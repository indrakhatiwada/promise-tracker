import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma-client';
import { PartyList } from './party-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getParties() {
  return await prisma.party.findMany({
    orderBy: {
      shortName: 'asc',
    },
  });
}

export default async function PartiesPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  const parties = await getParties();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Political Parties</h2>
        <Link href="/admin/parties/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Add New Party
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <PartyList parties={parties} />
      </div>
    </div>
  );
}
