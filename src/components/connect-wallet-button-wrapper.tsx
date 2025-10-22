'use client';

import { useEffect, useState } from 'react';
import { ConnectWalletButton } from './connect-wallet-button';
import { ButtonProps } from './ui/button';

export function ConnectWalletButtonWrapper(props: ButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a placeholder
  }

  return <ConnectWalletButton {...props} />;
}
