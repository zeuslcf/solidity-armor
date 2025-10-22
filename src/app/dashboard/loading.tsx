import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
       <div className="max-w-md mx-auto">
        <Skeleton className="h-10 w-full" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg">
             <Skeleton className="h-10 w-10 mb-4 rounded-full" />
             <Skeleton className="h-4 w-40 mb-2" />
             <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-12 w-full mt-6" />
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <Skeleton className="h-8 w-40" />
           <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                <TableHead><Skeleton className="h-5 w-16" /></TableHead>
                <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
