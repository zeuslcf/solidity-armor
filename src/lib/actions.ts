'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { analyzeUploadedContract } from '@/ai/flows/analyze-uploaded-contract';
import { suggestFix } from '@/ai/flows/ai-powered-fix-suggestions';
import type { Scan, Vulnerability } from './definitions';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Define a union schema for file upload or URL
const ScanSchema = z
  .object({
    userId: z.string(),
    file: z.instanceof(File).optional(),
    url: z.string().url().optional(),
  })
  .refine((data) => !!data.file || !!data.url, {
    message: 'Either a file or a URL must be provided.',
    path: ['file'],
  });

type ScanState = {
  message: string | null;
  error?: boolean;
};

function calculateRiskSummary(
  vulnerabilities: Vulnerability[]
): 'Low' | 'Medium' | 'High' | 'None' {
  if (
    vulnerabilities.some(
      (v) => v.severity === 'High' || v.severity === 'Critical'
    )
  )
    return 'High';
  if (vulnerabilities.some((v) => v.severity === 'Medium')) return 'Medium';
  if (vulnerabilities.some((v) => v.severity === 'Low')) return 'Low';
  return 'None';
}

async function createScan(scanData: {
  userId: string;
  contractName: string;
  status: 'Pending' | 'Analyzing' | 'Completed' | 'Failed';
  sourceCode: string;
  contractUrl?: string;
}): Promise<Scan> {
  const { firestore } = initializeFirebase();
  const { userId, ...rest } = scanData;
  if (!userId) throw new Error('User ID is required to create a scan.');

  const scansRef = collection(firestore, 'users', userId, 'scans');
  const newScanRef = await addDoc(scansRef, {
    ...rest,
    userId: userId, // ensure userId is part of the document data
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    vulnerabilities: [],
    summary: '',
    riskSummary: null,
  });

  return {
    id: newScanRef.id,
    ...scanData,
    createdAt: new Date().toISOString(),
    vulnerabilities: [],
    summary: '',
    riskSummary: null,
  };
}

async function updateScan(
  userId: string,
  scanId: string,
  updates: Partial<Omit<Scan, 'id'>>
): Promise<void> {
  const { firestore } = initializeFirebase();
  if (!userId || !scanId)
    throw new Error('User ID and Scan ID are required to update a scan.');
  const scanRef = doc(firestore, 'users', userId, 'scans', scanId);
  await updateDoc(scanRef, { ...updates, updatedAt: serverTimestamp() });
}

async function getContractFromUrl(
  url: string
): Promise<{ content: string; name: string }> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch from URL: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (
      !contentType ||
      (!contentType.includes('text/plain') &&
        !contentType.includes('application/octet-stream'))
    ) {
      // Allow octet-stream for raw files from services like GitHub
      // Consider a more robust check if needed
    }

    const contentLength = response.headers.get('content-length');
    // Limit to 1MB
    if (contentLength && parseInt(contentLength, 10) > 1024 * 1024) {
      throw new Error('File size from URL exceeds the 1MB limit.');
    }

    const content = await response.text();
    const name = url.split('/').pop() || 'contract.sol';
    return { content, name };
  } catch (error) {
    console.error('Error fetching contract from URL:', error);
    if (error instanceof Error) {
      throw new Error(
        `Could not retrieve or process the smart contract from the provided URL. ${error.message}`
      );
    }
    throw new Error(
      'An unknown error occurred while fetching the contract from the URL.'
    );
  }
}

export async function handleScan(
  prevState: ScanState,
  formData: FormData
): Promise<ScanState> {
  const validatedFields = ScanSchema.safeParse({
    userId: formData.get('userId'),
    file: formData.get('file'),
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    return {
      message:
        validatedFields.error.flatten().fieldErrors.file?.[0] ||
        'Invalid data provided.',
      error: true,
    };
  }

  const { userId, file, url } = validatedFields.data;
  let fileContent: string;
  let contractName: string;
  let contractUrl: string | undefined = url;

  if (url) {
    try {
      const { content, name } = await getContractFromUrl(url);
      fileContent = content;
      contractName = name;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch from URL.';
      return { message, error: true };
    }
  } else if (file && file.size > 0 && file.name.endsWith('.sol')) {
    fileContent = await file.text();
    contractName = file.name;
    contractUrl = file.name; // For display/reference purposes
  } else {
    return {
      message:
        'Please upload a valid smart contract (.sol) or provide a valid URL.',
      error: true,
    };
  }

  const fileDataUri = `data:text/plain;base64,${Buffer.from(
    fileContent
  ).toString('base64')}`;

  let scan: Scan | undefined;
  try {
    scan = await createScan({
      userId,
      contractName: contractName,
      status: 'Pending',
      sourceCode: fileContent,
      contractUrl: contractUrl,
    });

    await updateScan(userId, scan.id, { status: 'Analyzing' });
    revalidatePath('/dashboard'); // Revalidate to show "Analyzing" status

    const analysisResult = await analyzeUploadedContract({
      contractUrl: fileDataUri,
    });

    await updateScan(userId, scan.id, {
      status: 'Completed',
      vulnerabilities: analysisResult.vulnerabilities,
      summary: analysisResult.summary,
      riskSummary: calculateRiskSummary(analysisResult.vulnerabilities),
      updatedAt: serverTimestamp(),
    });

    revalidatePath('/dashboard');
    return { message: `Scan for ${contractName} completed successfully!` };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : 'An unknown error occurred.';
    console.error('Error during scan:', errorMessage);
    if (scan && userId) {
      await updateScan(userId, scan.id, {
        status: 'Failed',
        summary: `Scan failed: ${errorMessage}`,
        updatedAt: serverTimestamp(),
      });
    }
    revalidatePath('/dashboard');
    return {
      message: `An error occurred during the scan for ${contractName}.`,
      error: true,
    };
  }
}

export async function getFixSuggestion(
  vulnerability: Vulnerability,
  contractCode: string
): Promise<string> {
  const result = await suggestFix({
    smartContractSourceCode: contractCode,
    vulnerabilityReport: JSON.stringify(vulnerability, null, 2),
  });
  return result.fixSuggestions;
}