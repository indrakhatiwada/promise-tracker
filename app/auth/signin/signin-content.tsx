'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Promise Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to track and monitor political promises
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error === 'AccessDenied' 
              ? 'You do not have permission to access this resource.'
              : 'An error occurred while signing in. Please try again.'}
          </div>
        )}

        <Button onClick={handleSignIn} className="w-full">
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
