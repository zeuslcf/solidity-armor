'use client';

import { useUser } from '@/firebase';
import DashboardClient from '@/components/dashboard-client';
import Loading from './loading';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading || !user) {
    return <Loading />;
  }

  return <DashboardClient userId={user.uid} />;
}
