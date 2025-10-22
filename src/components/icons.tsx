import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <Shield {...props} />
);

export const Spinner = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('animate-spin', className)}
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const SolidityIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 2 7.098 4.048-3.55 11.906L12 22l-3.548-4.046L4.902 6.048z" />
    <path d="M12 2v20" />
    <path d="M12 2 4.902 6.048l7.098 11.906" />
    <path d="m12 2 7.098 4.048-7.098 11.906" />
  </svg>
);

export const EthereumIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2 4 12l8 10 8-10Z" />
    <path d="m4 12 8 2 8-2" />
    <path d="M12 2v20" />
  </svg>
);
