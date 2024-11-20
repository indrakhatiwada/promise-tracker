'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserNav } from './user-nav';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';
import { User } from 'next-auth';

interface MainNavProps {
  user: User | null;
}

export function MainNav({ user }: MainNavProps) {
  const pathname = usePathname();

  const handleLogin = () => {
    signIn('google');
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/" className="font-bold text-xl">
          Promise Tracker
        </Link>
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 flex-1">
          <Link
            href="/promises"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/promises'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            Promises
          </Link>
          <Link
            href="/submit"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/submit'
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            Submit Promise
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <UserNav user={user} />
          ) : (
            <Button onClick={handleLogin}>Sign in</Button>
          )}
        </div>
      </div>
    </div>
  );
}
