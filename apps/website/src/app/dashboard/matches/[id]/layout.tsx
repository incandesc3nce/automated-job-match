import { DashboardHeader } from '@/components/common/DashboardHeader';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset } from '@/components/ui/sidebar';

export default async function MatchesLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInset>
      <DashboardHeader>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">Дэшборд</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Подборки</BreadcrumbPage>
        </BreadcrumbItem>
      </DashboardHeader>
      {children}
    </SidebarInset>
  );
}
