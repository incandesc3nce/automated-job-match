export type Match = {
  id: string;
  externalUrl: string;
  score: number;
  reasoning: string;

  jobTitle: string;
  jobCompanyName: string;
  jobLocation: string;
  jobDescription: string;
  jobSalaryFrom: string | null;
  jobSalaryTo: string | null;
  jobSalaryExtra: string | null;
  jobSkills: string[];
  jobSource: string;
  jobWorkFormat: string[];
  jobPostedAt: Date;

  createdAt: Date;
  updatedAt: Date;
};

export type MatchesResponse = {
  matches: Match[];
  hiddenMatches: Match[];
  total: number;
};
