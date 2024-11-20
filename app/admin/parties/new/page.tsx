import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PartyForm } from '../party-form';

export default async function NewPartyPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Add New Party</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <PartyForm />
      </div>
    </div>
  );
}
