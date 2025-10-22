'use client';

import { Sparkles } from 'lucide-react';

import { EthereumIcon, Logo, SolidityIcon } from '@/components/icons';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConnectWalletButtonWrapper } from '@/components/connect-wallet-button-wrapper';

const features = [
  {
    icon: <SolidityIcon className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Vulnerability Detection',
    description:
      'Leverage our advanced AI to scan your Solidity contracts for a wide range of known vulnerabilities, from reentrancy to integer overflows.',
  },
  {
    icon: <EthereumIcon className="h-8 w-8 text-primary" />,
    title: 'Comprehensive Risk Analysis',
    description:
      'Receive a detailed report with severity levels and risk scores for each issue, helping you prioritize what to fix first.',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'Actionable AI Fix Suggestions',
    description:
      "Don't just find problems—solve them. Get AI-generated code snippets and recommendations to patch vulnerabilities quickly.",
  },
];

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900/50 [mask-image:linear-gradient(to_bottom,white_5%,transparent_50%)]"></div>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-background/90 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Logo className="size-7 text-primary" />
          <span className="text-lg">Solidity Armor</span>
        </div>
        <div className="ml-auto">
          <ConnectWalletButtonWrapper />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative flex flex-col items-center justify-center text-center py-24 md:py-32 lg:py-40">
          <div className="bg-glow"></div>
          <div className="container z-10">
            <Badge
              variant="outline"
              className="mb-4 border-primary/50 bg-primary/10 text-primary"
            >
              Advanced AI Security Audits
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
              Fortify Your Smart Contracts
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Solidity Armor is your AI-powered defense against costly exploits.
              Upload your code, get a detailed vulnerability report, and secure
              your project with confidence.
            </p>
            <div className="mt-8 flex justify-center">
              <ConnectWalletButtonWrapper
                size="lg"
                className="shadow-lg shadow-primary/20"
              />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background/80 backdrop-blur-sm z-10 relative">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold font-headline">
                Your On-Chain Guardian
              </h2>
              <p className="mt-2 text-muted-foreground">
                Go beyond manual audits. Our intelligent scanner acts as a
                tireless security expert, protecting your assets 24/7.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-border/40 bg-card/60 backdrop-blur-sm transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
                >
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="z-10 border-t border-border/40 bg-background/90 py-6">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Solidity Armor. All Rights
          Reserved.
        </div>
      </footer>
    </div>
  );
}
