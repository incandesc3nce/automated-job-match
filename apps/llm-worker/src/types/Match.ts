export type Match = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string;
  verdict: 'strong_match' | 'good_match' | 'partial_match' | 'poor_match';
};
