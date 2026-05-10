import { jobSourceLinkMap } from '@/utils/jobSourceLinkMap';
import { and, count, db, desc, eq, jobs, matches } from '@career-ai/db';

type MatchesQueryParams = {
  cvId: string;
  userId: string;
  hidden?: boolean;
};

export const getMatches = async ({
  cvId,
  userId,
  limit = 30,
  offset = 0,
  hidden,
}: MatchesQueryParams & {
  limit?: number;
  offset?: number;
}) => {
  const matchRows = await db
    .select({
      id: matches.id,
      score: matches.score,
      reasoning: matches.reasoning,
      hidden: matches.hidden,
      createdAt: matches.createdAt,
      updatedAt: matches.updatedAt,
      jobTitle: jobs.title,
      jobSource: jobs.source,
      jobExternalId: jobs.externalId,
      jobCompanyName: jobs.companyName,
      jobLocation: jobs.location,
      jobDescription: jobs.shortDescription,
      jobWorkFormat: jobs.workFormat,
      jobSalaryFrom: jobs.salaryFrom,
      jobSalaryTo: jobs.salaryTo,
      jobSalaryExtra: jobs.salaryExtra,
      jobSkills: jobs.skills,
      jobPostedAt: jobs.postedAt,
    })
    .from(matches)
    .leftJoin(jobs, eq(matches.jobId, jobs.id))
    .where(
      and(
        eq(matches.cvId, cvId),
        eq(matches.userId, userId),
        eq(matches.hidden, hidden ?? false),
      ),
    )
    .orderBy(desc(matches.score), desc(matches.createdAt))
    .limit(limit)
    .offset(offset);

  const matchRowsWithUrl = matchRows.map((match) => ({
    ...match,
    externalUrl: jobSourceLinkMap[match.jobSource!]!(match.jobExternalId!),
  }));

  return matchRowsWithUrl;
};

export const getMatchesCount = async ({ cvId, userId, hidden }: MatchesQueryParams) => {
  const [total] = await db
    .select({ count: count() })
    .from(matches)
    .where(
      and(
        eq(matches.cvId, cvId),
        eq(matches.userId, userId),
        eq(matches.hidden, hidden ?? false),
      ),
    );

  return total?.count || 0;
};
