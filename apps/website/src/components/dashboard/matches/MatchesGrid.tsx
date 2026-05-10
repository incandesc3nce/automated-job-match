'use client';

import { HiddenMatchesResponse, MatchesResponse } from '@/types/dashboard/matches/Match';
import { MatchArticle } from './MatchArticle';
import { useMatchesSSE } from '@/hooks/useMatchesSSE';

type MatchesGridProps = {
  cvId: string;
  total: number;
} & (
  | {
      matches: MatchesResponse['matches'];
      showHidden?: false;
    }
  | {
      hiddenMatches: HiddenMatchesResponse['hiddenMatches'];
      showHidden: true;
    }
);

export const MatchesGrid = (props: MatchesGridProps) => {
  useMatchesSSE(props.cvId);

  return (
    <div className="px-4 my-2 items-start grid grid-cols-1 lg:grid-cols-2 gap-4">
      {props.showHidden &&
        props.hiddenMatches.length > 0 &&
        props.hiddenMatches.map((match) => (
          <MatchArticle key={match.id} match={match} hidden />
        ))}
      {!props.showHidden &&
        props.matches.length > 0 &&
        props.matches.map((match) => <MatchArticle key={match.id} match={match} />)}
    </div>
  );
};
