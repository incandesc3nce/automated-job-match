import { DashboardHeader } from '@/components/common/DashboardHeader';
import { MatchesGrid } from '@/components/dashboard/matches/MatchesGrid';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { SidebarInset } from '@/components/ui/sidebar';
import { Typography } from '@/components/ui/typography';
import { HiddenMatchesResponse } from '@/types/dashboard/matches/Match';
import { ServerAPIFetch } from '@/utils/ServerAPIFetch';
import Link from 'next/link';

export default async function HiddenMatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchesRes = await ServerAPIFetch<HiddenMatchesResponse>(
    `/api/v1/cvs/${id}/matches/hidden`,
  );

  return (
    <SidebarInset>
      <DashboardHeader>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">Дэшборд</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/dashboard/matches/${id}`}>Подборки</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Скрытые подборки</BreadcrumbPage>
        </BreadcrumbItem>
      </DashboardHeader>
      <div>
        <div className="px-4 my-2">
          <Typography tag="h2">Скрытые подборки вакансий</Typography>
          <Link href={`/dashboard/matches/${id}`}>
            <Button variant="outline" size="sm" className="mt-2">
              Показать не скрытые подборки
            </Button>
          </Link>
        </div>
        {matchesRes.success && (
          <MatchesGrid
            cvId={id}
            hiddenMatches={matchesRes.data.hiddenMatches}
            total={matchesRes.data.total}
            showHidden
          />
        )}
      </div>
    </SidebarInset>
  );
}
