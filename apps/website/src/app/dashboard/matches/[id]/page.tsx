import { DashboardHeader } from '@/components/common/DashboardHeader';
import { MatchArticle } from '@/components/dashboard/matches/MatchArticle';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset } from '@/components/ui/sidebar';
import { Typography } from '@/components/ui/typography';
import { MatchesResponse } from '@/types/dashboard/matches/Match';
import { ServerAPIFetch } from '@/utils/ServerAPIFetch';

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchesRes = await ServerAPIFetch<MatchesResponse>(`/api/v1/cvs/${id}/matches`);

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
      <div className="px-4 my-2">
        <Typography tag="h2">Подборки вакансий</Typography>
      </div>
      <div className="px-4 my-2 items-start grid grid-cols-1 lg:grid-cols-2 gap-4">
        {matchesRes.success &&
          matchesRes.data.matches.length > 0 &&
          matchesRes.data.matches.map((match) => (
            <MatchArticle key={match.id} match={match} />
          ))}
      </div>
    </SidebarInset>
  );
}
