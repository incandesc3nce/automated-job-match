'use client';

import { MatchesResponse } from '@/types/dashboard/matches/Match';
import { MatchArticle } from './MatchArticle';
import { useMatchesSSE } from '@/hooks/useMatchesSSE';

type MatchesGridProps = MatchesResponse & {
  cvId: string;
};

export const MatchesGrid = ({
  matches,
  hiddenMatches,
  total,
  cvId,
}: MatchesGridProps) => {
  useMatchesSSE(cvId);

  return (
    <div className="px-4 my-2 items-start grid grid-cols-1 lg:grid-cols-2 gap-4">
      {matches.length > 0 &&
        matches.map((match) => <MatchArticle key={match.id} match={match} />)}
    </div>
  );
};
