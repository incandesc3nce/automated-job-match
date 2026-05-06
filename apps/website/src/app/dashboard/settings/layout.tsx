import { DashboardHeader } from '@/components/common/DashboardHeader';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset } from '@/components/ui/sidebar';
import { ChildrenProps } from '@/types/ChildrenProps';

export default async function SettingsLayout({ children }: ChildrenProps) {
  return (
    <SidebarInset>
      <DashboardHeader>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">Дэшборд</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>Настройки</BreadcrumbPage>
        </BreadcrumbItem>
      </DashboardHeader>
      {children}
    </SidebarInset>
  );
}
