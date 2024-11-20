import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromiseList } from './promise-list';

async function getPendingPromises() {
  try {
    const promises = await prisma.promise.findMany({
      where: {
        status: Status.PENDING
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return promises;
  } catch (error) {
    console.error('Error fetching pending promises:', error);
    return [];
  }
}

async function getAllPromises() {
  try {
    const promises = await prisma.promise.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return promises;
  } catch (error) {
    console.error('Error fetching all promises:', error);
    return [];
  }
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  
  if (!user?.role || user.role !== 'ADMIN') {
    console.log('Admin Root Page - Access Denied:', user);
    redirect('/');
  }

  const [pendingPromises, allPromises] = await Promise.all([
    getPendingPromises(),
    getAllPromises(),
  ]);

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({pendingPromises.length})</TabsTrigger>
          <TabsTrigger value="all">All Promises ({allPromises.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <div className="rounded-md border">
            <PromiseList promises={pendingPromises} />
          </div>
        </TabsContent>
        <TabsContent value="all">
          <div className="rounded-md border">
            <PromiseList promises={allPromises} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
