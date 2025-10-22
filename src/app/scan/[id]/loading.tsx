import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ScanReportLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                <div className='flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-muted/30'>
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-24 mt-1" />
                </div>
                <div className='flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-muted/30'>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-10 mt-1" />
                </div>
                <div className="col-span-2 md:col-span-1 grid grid-cols-2 gap-4 text-left p-4 rounded-lg bg-muted/30">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-2 w-2 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4" />
                      </div>
                    ))}
                </div>
            </div>
            <Separator className="my-6" />
            <div className='space-y-2'>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-10/12 mt-1" />
            </div>
        </CardContent>
      </Card>

      <div className='space-y-4'>
        <Skeleton className="h-7 w-48" />
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                    </div>
                    <Skeleton className="h-7 w-24 rounded-full" />
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12 mt-2" />
                <Skeleton className="h-9 w-40 mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
