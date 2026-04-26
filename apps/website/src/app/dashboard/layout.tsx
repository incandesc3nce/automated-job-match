import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getCurrentSession } from '@/lib/getCurrentSession';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentSession();
  if (!user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
