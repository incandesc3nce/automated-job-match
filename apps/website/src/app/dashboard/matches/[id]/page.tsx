import { MatchesGrid } from '@/components/dashboard/matches/MatchesGrid';
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
    <div>
      <div className="px-4 my-2">
        <Typography tag="h2">Подборки вакансий</Typography>
      </div>
      {matchesRes.success && (
        <MatchesGrid
          cvId={id}
          matches={matchesRes.data.matches}
          hiddenMatches={matchesRes.data.hiddenMatches}
          total={matchesRes.data.total}
        />
      )}
    </div>
  );
}
