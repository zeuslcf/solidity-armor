'use client';

import { notFound } from 'next/navigation';
import VulnerabilityReport from '@/components/vulnerability-report';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { Scan } from '@/lib/definitions';
import ScanReportLoading from './loading';
import { doc } from 'firebase/firestore';

export default function ScanReportPage({ params }: { params: { id: string } }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const scanRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid, 'scans', params.id);
  }, [user, firestore, params.id]);

  const { data: scan, isLoading: isScanLoading } = useDoc<Scan>(scanRef);

  if (isUserLoading || isScanLoading) {
    return <ScanReportLoading />;
  }

  if (!scan) {
    notFound();
  }

  // The 'scan' object will not be null here due to the check above, but TypeScript
  // might not infer it. We can assert it's not null.
  return <VulnerabilityReport scan={scan!} contractCode={scan!.sourceCode} />;
}
