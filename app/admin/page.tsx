import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma-client';
import { Status } from '@prisma/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from './stats-cards';
import { PromisesTable } from './promises-table';

async function getPendingPromises() {
  return await prisma.promise.findMany({
    where: {
      status: Status.PENDING,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  console.log('Admin Root Page - User:', user);
  console.log('Admin Root Page - Role:', user?.role);

  if (!user?.role || user.role !== 'ADMIN') {
    console.log('Admin Root Page - Access Denied:', user);
    redirect('/');
  }

  const pendingPromises = await getPendingPromises();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>
      
      <StatsCards />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Promises</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <PromisesTable promises={pendingPromises} />
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <PromisesTable promises={pendingPromises.filter(p => p.status === Status.PENDING)} />
        </TabsContent>
        <TabsContent value="approved" className="space-y-4">
          <PromisesTable promises={pendingPromises.filter(p => p.status === Status.APPROVED)} />
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          <PromisesTable promises={pendingPromises.filter(p => p.status === Status.REJECTED)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
