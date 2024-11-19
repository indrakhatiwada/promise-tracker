'use client';

import { Promise } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminPromiseListProps {
  promises: Promise[];
}

export function AdminPromiseList({ promises }: AdminPromiseListProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function updatePromiseStatus(promiseId: string, status: 'APPROVED' | 'REJECTED') {
    try {
      setUpdating(promiseId);
      const response = await fetch(`/api/promises/${promiseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update promise');
      }

      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      // Handle error state
    } finally {
      setUpdating(null);
    }
  }

  if (promises.length === 0) {
    return <p className="text-gray-500">No pending promises to review.</p>;
  }

  return (
    <div className="space-y-6">
      {promises.map((promise) => (
        <div
          key={promise.id}
          className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{promise.promiserName}</h3>
              <p className="text-sm text-gray-500">
                Submitted on {new Date(promise.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updatePromiseStatus(promise.id, 'APPROVED')}
                disabled={updating === promise.id}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => updatePromiseStatus(promise.id, 'REJECTED')}
                disabled={updating === promise.id}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">{promise.description}</p>

          <div className="text-sm text-gray-500">
            <p>Party: {promise.party}</p>
            <p>Promised Date: {new Date(promise.promisedDate).toLocaleDateString()}</p>
            <a
              href={promise.articleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View Source Article →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
