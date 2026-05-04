import { DashboardHeader } from '@/components/common/DashboardHeader';
import {
  BreadcrumbItem,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { SidebarInset } from '@/components/ui/sidebar';
import { Typography } from '@/components/ui/typography';

export default function DashboardPage() {
  return (
    <SidebarInset>
      <DashboardHeader>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbPage>Дэшборд</BreadcrumbPage>
        </BreadcrumbItem>
      </DashboardHeader>
      <div className="px-4 my-2">
        <Typography tag='h2'>Выберите резюме, чтобы получить актуальные подборки вакансий</Typography>
      </div>
    </SidebarInset>
  );
}
