'use client';

import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { shortenAddress } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { injected } from 'wagmi/connectors';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Wallet, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/firebase';
import { usePathname } from 'next/navigation';

export function ConnectWalletButton(props: ButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    onSuccess: () => {
      router.push('/dashboard');
    },
  });
  const { disconnect } = useDisconnect();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleDisconnect = () => {
    disconnect();
    if (auth) {
      signOut(auth);
    }
    router.push('/');
  };

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full" {...props}>
            <Avatar className="h-6 w-6 mr-2">
              <AvatarFallback className="bg-transparent border-2 border-primary/50 text-primary">
                <Wallet className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span>{shortenAddress(address!)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pathname !== '/dashboard' && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Open Platform</span>
              </Link>
            </DropdownMenuItem>
          )}
          {pathname !== '/dashboard' && <DropdownMenuSeparator />}
          <DropdownMenuItem onClick={handleDisconnect}>Disconnect</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={() => connect({ connector: injected() })} className="w-full" {...props}>
      <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
    </Button>
  );
}
