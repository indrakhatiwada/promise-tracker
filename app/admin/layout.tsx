import { AdminSidebar } from '@/components/admin/sidebar';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <AdminSidebar />
      </div>
      <div className="flex-1">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
