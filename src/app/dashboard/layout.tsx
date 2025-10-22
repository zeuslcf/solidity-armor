'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { Logo } from '@/components/icons';
import Loading from '../loading';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { ConnectWalletButtonWrapper } from '@/components/connect-wallet-button-wrapper';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isConnected, address } = useAccount();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    const signInAndCreateUser = async () => {
      if (isConnected && address && !user && !isUserLoading && auth && firestore) {
        try {
          const userCredential = await signInAnonymously(auth);
          const firebaseUser = userCredential.user;

          if (firebaseUser) {
            const userRef = doc(firestore, 'users', firebaseUser.uid);
            await setDoc(
              userRef,
              {
                id: firebaseUser.uid,
                createdAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } catch (error) {
          console.error('Error signing in or creating user document: ', error);
        }
      }
    };
    signInAndCreateUser();
  }, [isConnected, address, user, isUserLoading, auth, firestore]);

  useEffect(() => {
    if (!isUserLoading && !user && isConnected) {
       // Still waiting for user to be created after wallet connection
    } else if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [isUserLoading, user, isConnected, router]);

  if (isUserLoading || !user || !isConnected) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900/50 [mask-image:linear-gradient(to_bottom,white_5%,transparent_50%)]"></div>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Logo className="size-7 text-primary" />
          <span className="text-lg">Solidity Armor</span>
        </div>
        <div className="ml-auto">
          <ConnectWalletButtonWrapper />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 z-0 relative">
        <div className="bg-glow"></div>
        {children}
      </main>
    </div>
  );
}
