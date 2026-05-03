import { AppSidebar } from '@/components/dashboard/sidebar/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
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
      <TooltipProvider>
        <AppSidebar />
        {children}
      </TooltipProvider>
    </SidebarProvider>
  );
}
