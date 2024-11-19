import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PromiseForm } from './promise-form';

export default async function SubmitPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Submit a Promise</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <PromiseForm />
      </div>
    </div>
  );
}
