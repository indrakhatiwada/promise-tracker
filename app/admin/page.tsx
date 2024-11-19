import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminPromiseList } from './admin-promise-list';

async function getPendingPromises() {
  return await prisma.promise.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  const pendingPromises = await getPendingPromises();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Promises</h2>
          <AdminPromiseList promises={pendingPromises} />
        </div>
      </div>
    </div>
  );
}
