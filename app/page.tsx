import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-24 md:px-12 lg:px-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Track Political Promises
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hold politicians accountable by tracking their promises, from campaign pledges to policy commitments.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/promises"
                className="px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                View Promises
              </Link>
              <Link
                href="/submit"
                className="px-8 py-3 rounded-full bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Submit Promise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor the status of promises in real-time with verified updates and evidence.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Share Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate and share social media cards with promise updates and statistics.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Stay Informed</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get notifications when promises are updated or when new evidence is submitted.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
