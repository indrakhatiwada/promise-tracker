'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSignIn = async () => {
    try {
      await signIn('google', { 
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
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
              : error === 'OAuthSignin' 
              ? 'Error starting the sign-in process. Please try again.'
              : error === 'OAuthCallback'
              ? 'Error completing the sign-in process. Please try again.'
              : error === 'OAuthCreateAccount'
              ? 'Could not create user account. Please try again.'
              : error === 'EmailCreateAccount'
              ? 'Could not create user account. Please try again.'
              : error === 'Callback'
              ? 'Error during authentication callback. Please try again.'
              : error === 'OAuthAccountNotLinked'
              ? 'Email is already linked to another account.'
              : 'An error occurred while signing in. Please try again.'}
          </div>
        )}

        <Button 
          onClick={handleSignIn} 
          className="w-full"
          variant="default"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
