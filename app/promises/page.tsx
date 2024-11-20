import { prisma } from '@/lib/prisma-client';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

async function getPromises() {
  try {
    const promises = await prisma.promise.findMany({
      where: {
        status: 'APPROVED'
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return promises;
  } catch (error) {
    console.error('Error fetching promises:', error);
    return [];
  }
}

export default async function PromisesPage() {
  const promises = await getPromises();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Verified Political Promises</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promises.map((promise) => (
          <div
            key={promise.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            {promise.imageUrl && (
              <div className="mb-4 relative h-48 w-full">
                <img
                  src={promise.imageUrl}
                  alt={promise.promiserName}
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{promise.promiserName}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span>{promise.party}</span>
                  <span>•</span>
                  <span>{format(new Date(promise.promisedDate), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Verified
              </Badge>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {promise.description}
            </p>
            
            {promise.articleLink && (
              <div className="mt-4">
                <Link
                  href={promise.articleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
                >
                  <span>Read Source</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              </div>
            )}
            
            <div className="mt-4 text-sm text-gray-500">
              Submitted by {promise.user.name}
            </div>
          </div>
        ))}
      </div>
      
      {promises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No verified promises found.</p>
        </div>
      )}
    </div>
  );
}
