'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FileText,
  History,
  Link2,
  ScanLine,
  ShieldQuestion,
  UploadCloud,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleScan } from '@/lib/actions';
import type { Scan } from '@/lib/definitions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EthereumIcon, SolidityIcon, Spinner } from './icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query, Timestamp } from 'firebase/firestore';

function FileUploadTab({
  onFileChange,
  contractName,
  fileInputRef,
  onClearFile,
}: {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  contractName: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onClearFile: () => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && fileInputRef.current) {
      fileInputRef.current.files = files;
      // Manually trigger the change event
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  return (
    <>
      {!contractName ? (
        <label
          htmlFor="file-upload"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragEnter}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300',
            'border-border/60 hover:border-primary/80 bg-background/30 hover:bg-muted/30',
            isDragOver && 'border-primary shadow-lg shadow-primary/30 scale-105'
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadCloud
              className={cn(
                'w-10 h-10 mb-4 text-muted-foreground transition-colors',
                isDragOver && 'text-primary'
              )}
            />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-muted-foreground/80 flex items-center gap-1.5">
              <SolidityIcon className="w-3 h-3" /> Solidity smart contract (.sol)
            </p>
          </div>
          <Input
            id="file-upload"
            name="file"
            type="file"
            className="sr-only"
            onChange={onFileChange}
            accept=".sol"
            ref={fileInputRef}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between w-full h-48 border-2 border-solid border-green-500/20 bg-green-500/10 rounded-lg p-6">
          <div className="space-y-2">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
            <p className="text-lg font-medium text-foreground">
              Smart Contract Ready
            </p>
            <p className="font-mono text-sm text-muted-foreground">
              {contractName}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearFile}
            className="self-start hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
}

function UrlInputTab({
  url,
  setUrl,
}: {
  url: string;
  setUrl: (url: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border/60 bg-background/30 rounded-lg p-6">
      <Link2 className="w-10 h-10 mb-4 text-muted-foreground" />
      <p className="mb-2 text-sm text-center text-muted-foreground">
        Enter a public URL to a raw smart contract file.
      </p>
      <Input
        name="url"
        type="url"
        placeholder="https://github.com/user/repo/blob/main/contract.sol"
        className="max-w-md"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
    </div>
  );
}

function NewScanTab({
  userId,
  isScanning,
  onScanClick,
}: {
  userId: string;
  isScanning: boolean;
  onScanClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [scanMode, setScanMode] = useState('upload'); // 'upload' or 'url'
  const [contractName, setContractName] = useState('');
  const [contractUrl, setContractUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanFee = '0.005';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContractName(file.name);
    } else {
      setContractName('');
    }
  };

  const handleUrlChange = (url: string) => {
    setContractUrl(url);
  };
  
  const handleTabChange = (value: string) => {
    setScanMode(value);
    // Clear inputs when switching tabs
    setContractName('');
    setContractUrl('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };


  const handleClearFile = () => {
    setContractName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isScanButtonDisabled = (scanMode === 'upload' && !contractName) || (scanMode === 'url' && !contractUrl) || isScanning;

  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle>Start New Analysis</CardTitle>
        <CardDescription>
          Upload a Solidity smart contract or provide a public URL to begin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Input type="hidden" name="userId" value={userId} />

          <Tabs value={scanMode} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <UploadCloud className="mr-2" /> Upload Contract
              </TabsTrigger>
              <TabsTrigger value="url">
                <Link2 className="mr-2" /> From URL
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              <FileUploadTab
                onFileChange={handleFileChange}
                contractName={contractName}
                fileInputRef={fileInputRef}
                onClearFile={handleClearFile}
              />
            </TabsContent>
            <TabsContent value="url" className="mt-4">
              <UrlInputTab url={contractUrl} setUrl={handleUrlChange} />
            </TabsContent>
          </Tabs>

          <Button
            onClick={onScanClick}
            disabled={isScanButtonDisabled}
            className="w-full text-lg py-6 shadow-lg shadow-primary/20 transition-all duration-300 transform hover:scale-105"
          >
            {isScanning ? (
              <Spinner className="mr-2" />
            ) : (
              <ScanLine className="mr-2" />
            )}
            Scan Now for {scanFee}
            <EthereumIcon className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const RiskBadge = ({ summary }: { summary: Scan['riskSummary'] }) => {
  if (!summary)
    return (
      <Badge variant="secondary" className="bg-gray-700/50 text-gray-300">
        N/A
      </Badge>
    );

  switch (summary) {
    case 'High':
      return (
        <Badge
          variant="destructive"
          className="bg-red-500/10 text-red-400 border-red-500/20"
        >
          <AlertTriangle className="mr-1 h-3 w-3 text-red-500" /> High
        </Badge>
      );
    case 'Medium':
      return (
        <Badge
          variant="destructive"
          className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
        >
          <AlertTriangle className="mr-1 h-3 w-3 text-yellow-500" /> Medium
        </Badge>
      );
    case 'Low':
      return (
        <Badge
          variant="secondary"
          className="bg-blue-500/10 text-blue-400 border-blue-500/20"
        >
          <ShieldQuestion className="mr-1 h-3 w-3 text-blue-500" /> Low
        </Badge>
      );
    case 'None':
      return (
        <Badge
          variant="secondary"
          className="bg-green-500/10 text-green-400 border-green-500/20"
        >
          <CheckCircle2 className="mr-1 h-3 w-3 text-green-500" /> None
        </Badge>
      );
    default:
      return <Badge variant="secondary">N/A</Badge>;
  }
};

const StatusBadge = ({ status }: { status: Scan['status'] }) => {
  switch (status) {
    case 'Completed':
      return (
        <Badge
          variant="default"
          className="bg-green-500/10 border-green-500/20 text-green-400"
        >
          Completed
        </Badge>
      );
    case 'Analyzing':
      return (
        <Badge
          variant="secondary"
          className="bg-blue-500/10 border-blue-500/20 text-blue-400"
        >
          <Spinner className="mr-1 h-3 w-3" /> Analyzing
        </Badge>
      );
    case 'Failed':
      return <Badge variant="destructive">Failed</Badge>;
    case 'Pending':
      return <Badge variant="outline">Pending</Badge>;
    default:
      return (
        <Badge variant="secondary" className="bg-gray-700/50 text-gray-300">
          {status}
        </Badge>
      );
  }
};

const convertTimestamp = (timestamp: any): string => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

function ScanHistoryTab({
  scans,
  isLoading,
}: {
  scans: Scan[] | null;
  isLoading: boolean;
}) {
  const formattedScans = (scans || []).map((scan) => ({
    ...scan,
    createdAt: scan.createdAt
      ? formatDistanceToNow(new Date(convertTimestamp(scan.createdAt)), {
          addSuffix: true,
        })
      : 'N/A',
  }));

  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Scan History</CardTitle>
        <CardDescription>
          Review your past smart contract analyses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/20 hover:bg-transparent">
              <TableHead>Smart Contract Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Spinner className="h-6 w-6 mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : formattedScans.length > 0 ? (
              formattedScans.map((scan) => (
                <TableRow
                  key={scan.id}
                  className="border-border/20 hover:bg-white/5 transition-colors"
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {scan.contractName}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={scan.status} />
                  </TableCell>
                  <TableCell>
                    <RiskBadge summary={scan.riskSummary} />
                  </TableCell>
                  <TableCell>{scan.createdAt}</TableCell>
                  <TableCell>
                    {scan.status === 'Completed' ? (
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/20"
                      >
                        <Link href={`/scan/${scan.id}`}>
                          <ChevronRight className="h-4 w-4 text-primary" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" disabled>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-muted-foreground"
                >
                  No scans found. Upload a smart contract to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function DashboardClient({ userId }: { userId: string }) {
  const [state, formAction] = useActionState(handleScan, { message: null });
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const firestore = useFirestore();
  const scansQuery = useMemoFirebase(() => {
    if (!userId || !firestore) return null;
    return query(
      collection(firestore, 'users', userId, 'scans'),
      orderBy('createdAt', 'desc')
    );
  }, [userId, firestore]);

  const { data: scans, isLoading: isLoadingScans } =
    useCollection<Scan>(scansQuery);

  const { sendTransactionAsync, isPending: isSendingTransaction } =
    useSendTransaction();
  const [isScanning, setIsScanning] = useState(false);
  const scanFee = '0.005';
  const recipientAddress = process.env
    .NEXT_PUBLIC_RECIPIENT_WALLET_ADDRESS as `0x${string}` | undefined;

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.error ? 'Scan Failed' : 'Scan Status',
        description: state.message,
        variant: state.error ? 'destructive' : 'default',
      });
      if (!state.error) {
        // Optionally clear form on success
      }
      setIsScanning(false);
    }
  }, [state, toast]);

  const handleScanClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const file = formData.get('file') as File;
    const url = formData.get('url') as string;

    if ((!file || file.size === 0) && !url) {
      toast({
        title: 'No smart contract provided',
        description: 'Please upload a .sol file or provide a URL.',
        variant: 'destructive',
      });
      return;
    }

    if (!recipientAddress) {
      toast({
        title: 'Configuration Error',
        description: 'Recipient wallet address is not configured.',
        variant: 'destructive',
      });
      return;
    }

    if (formRef.current.checkValidity()) {
      setShowPaymentModal(true);
    } else {
      formRef.current.reportValidity();
    }
  };

  const handlePaymentConfirm = async () => {
    setShowPaymentModal(false);
    if (!formRef.current || !recipientAddress) return;

    setIsScanning(true);

    try {
      await sendTransactionAsync({
        to: recipientAddress,
        value: parseEther(scanFee),
      });

      toast({
        title: 'Transaction Sent',
        description: 'Your payment has been sent. Starting scan...',
      });

      const formData = new FormData(formRef.current);
      formAction(formData);
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: 'Payment Failed',
        description: 'Could not send payment. Please try again.',
        variant: 'destructive',
      });
      setIsScanning(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="scan" className="max-w-4xl mx-auto w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-muted/20 border border-border/20 p-1">
          <TabsTrigger
            value="scan"
            className="data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground"
          >
            <ScanLine className="mr-2" /> New Scan
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground"
          >
            <History className="mr-2" /> Scan History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="scan" className="mt-6">
          <form ref={formRef} action={formAction}>
            <NewScanTab
              userId={userId}
              onScanClick={handleScanClick}
              isScanning={isScanning || isSendingTransaction}
            />
          </form>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <ScanHistoryTab scans={scans} isLoading={isLoadingScans} />
        </TabsContent>
      </Tabs>

      <AlertDialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <AlertDialogContent className="bg-card/80 backdrop-blur-lg border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to pay {scanFee} ETH to scan your smart contract.
              This transaction cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePaymentConfirm}
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30"
              disabled={isSendingTransaction}
            >
              {isSendingTransaction ? (
                <Spinner className="mr-2" />
              ) : (
                <EthereumIcon className="mr-2" />
              )}
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
