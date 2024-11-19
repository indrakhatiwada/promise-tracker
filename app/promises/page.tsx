import { prisma } from '@/lib/prisma';
import { Promise } from '@prisma/client';

async function getPromises(): Promise<Promise[]> {
  return await prisma.promise.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function PromisesPage() {
  const promises = await getPromises();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Political Promises</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promises.map((promise) => (
          <div
            key={promise.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{promise.promiserName}</h3>
              <span className={`
                px-2 py-1 text-xs rounded-full
                ${promise.status === 'FULFILLED' && 'bg-green-100 text-green-800'}
                ${promise.status === 'BROKEN' && 'bg-red-100 text-red-800'}
                ${promise.status === 'PENDING' && 'bg-yellow-100 text-yellow-800'}
                ${promise.status === 'APPROVED' && 'bg-blue-100 text-blue-800'}
                ${promise.status === 'REJECTED' && 'bg-gray-100 text-gray-800'}
              `}>
                {promise.status}
              </span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {promise.description}
            </p>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Party: {promise.party}</p>
              <p>Promised Date: {promise.promisedDate.toLocaleDateString()}</p>
              <a
                href={promise.articleLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Source Article →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
