import { Spinner } from '@/components/icons';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="h-12 w-12" />
    </div>
  );
}
