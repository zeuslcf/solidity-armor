'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing uploaded smart contracts for vulnerabilities.
 *
 * It includes:
 * - analyzeUploadedContract: A function to initiate the smart contract analysis.
 * - AnalyzeUploadedContractInput: The input type for the analyzeUploadedContract function.
 * - AnalyzeUploadedContractOutput: The output type for the analyzeUploadedContract function, detailing the vulnerability report.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedContractInputSchema = z.object({
  contractUrl: z
    .string()
    .describe("A data URI of the smart contract. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AnalyzeUploadedContractInput = z.infer<typeof AnalyzeUploadedContractInputSchema>;

const VulnerabilitySchema = z.object({
  type: z.string().describe("The type of vulnerability identified."),
  description: z.string().describe("A detailed description of the vulnerability."),
  riskScore: z.number().describe("A numerical score indicating the risk level of the vulnerability (from 1 to 10)."),
  severity: z.enum(["Low", "Medium", "High", "Critical"]).describe("The severity level of the vulnerability."),
  suggestedFix: z.string().describe("AI-generated suggestions for fixing the identified vulnerability.").optional(),
});

const AnalyzeUploadedContractOutputSchema = z.object({
  vulnerabilities: z.array(VulnerabilitySchema).describe("A list of vulnerabilities identified in the smart contract."),
  summary: z.string().describe("A summary of the analysis, including the total number of vulnerabilities and the overall risk level."),
});
export type AnalyzeUploadedContractOutput = z.infer<typeof AnalyzeUploadedContractOutputSchema>;

export async function analyzeUploadedContract(input: AnalyzeUploadedContractInput): Promise<AnalyzeUploadedContractOutput> {
  return analyzeUploadedContractFlow(input);
}

const analyzeContractPrompt = ai.definePrompt({
  name: 'analyzeContractPrompt',
  input: {schema: AnalyzeUploadedContractInputSchema},
  output: {schema: AnalyzeUploadedContractOutputSchema},
  prompt: `You are a world-class smart contract security expert with deep knowledge of the latest blockchain vulnerabilities. Your task is to analyze the provided Solidity smart contract for potential security issues.

  Please provide a detailed vulnerability report in JSON format. For each vulnerability, include:
  - 'type': The specific class of vulnerability (e.g., "Reentrancy", "Integer Overflow", "Unchecked External Call").
  - 'description': A clear and concise explanation of the vulnerability, including which part of the code is affected.
  - 'riskScore': An integer from 1 (very low) to 10 (critical) representing the potential impact.
  - 'severity': A classification of the risk ("Low", "Medium", "High", or "Critical").
  - 'suggestedFix': (Optional) An AI-generated code snippet or detailed recommendation for how to remediate the vulnerability.

  After listing all vulnerabilities, provide an overall 'summary' of your findings.

  The smart contract code is provided as a data URI below.
  Contract: {{media url=contractUrl}}
  `,
});

const analyzeUploadedContractFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedContractFlow',
    inputSchema: AnalyzeUploadedContractInputSchema,
    outputSchema: AnalyzeUploadedContractOutputSchema,
  },
  async input => {
    const {output} = await analyzeContractPrompt(input);
    return output!;
  }
);
