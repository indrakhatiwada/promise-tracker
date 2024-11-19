'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PoliticalParty } from '@prisma/client';

export function PromiseForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      promiserName: formData.get('promiserName'),
      description: formData.get('description'),
      party: formData.get('party'),
      articleLink: formData.get('articleLink'),
      promisedDate: formData.get('promisedDate'),
    };

    try {
      const response = await fetch('/api/promises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit promise');
      }

      router.push('/promises');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      // Handle error state
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="promiserName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Promiser Name
        </label>
        <input
          type="text"
          name="promiserName"
          id="promiserName"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Promise Description
        </label>
        <textarea
          name="description"
          id="description"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
      </div>

      <div>
        <label htmlFor="party" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Political Party
        </label>
        <select
          name="party"
          id="party"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        >
          {Object.values(PoliticalParty).map((party) => (
            <option key={party} value={party}>
              {party}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="articleLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Article Link
        </label>
        <input
          type="url"
          name="articleLink"
          id="articleLink"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
      </div>

      <div>
        <label htmlFor="promisedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date Promised
        </label>
        <input
          type="date"
          name="promisedDate"
          id="promisedDate"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Promise'}
      </button>
    </form>
  );
}
