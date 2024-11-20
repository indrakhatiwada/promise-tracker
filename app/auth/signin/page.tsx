'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Promise Tracker
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to track and verify political promises
          </p>
        </div>
        <Button onClick={handleSignIn} className="w-full">
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
