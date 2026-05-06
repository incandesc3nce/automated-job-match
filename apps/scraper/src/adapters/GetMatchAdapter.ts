import type { RawJob } from '@/types/RawJob';
import { JobSourceAdapter } from './JobSourceAdapter';
import { db, jobs } from '@career-ai/db';
import type { GetMatchOfferDetails, GetMatchPageRes } from '@/types/getmatch';
import { sleep } from 'bun';
import * as cheerio from 'cheerio';
import { shortenDescriptionQueue } from '@career-ai/queue';

export class GetMatchAdapter extends JobSourceAdapter {
  private baseUrl = 'https://getmatch.ru';

  private extractExperience(offer: GetMatchOfferDetails): string {
    const seniority = offer.seniority ? offer.seniority.toLowerCase() : '';
    const years = offer.required_years_of_experience;

    if (!years) {
      return seniority || 'Not specified';
    } else {
      const seniorityLabel = seniority ? `(${seniority})` : '';
      return `${years} лет ${seniorityLabel}`.trim();
    }
  }

  private formatMap: Record<string, (typeof jobs.$inferInsert.workFormat)[number]> = {
    office: 'onsite',
    hybrid: 'hybrid',
    remote: 'remote',
    relocation_company: 'relocation_company',
  };

  async fetchJobs() {
    let page = 1;
    let count = 0;

    while (count < 250) {
      const searchParams = new URLSearchParams({
        sa: 'any',
        p: String(page),
        offset: String((page - 1) * 20),
        limit: String(20),
        pa: 'all',
      });

      console.log(`[getmatch] Fetching jobs from page ${page}...`);

      let searchRes;
      let searchData: GetMatchPageRes;
      try {
        searchRes = await fetch(`${this.baseUrl}/api/offers?${searchParams}`, {
          headers: {
            ...this.fetchHeaders,
            Cookie: 'NEXT_LOCALE=ru;',
          },
        });

        searchData = (await searchRes.json()) as GetMatchPageRes;

        if (searchData.offers.length === 0) {
          console.log(`[getmatch] No more offers found, stopping fetch.`);
          break;
        }
      } catch (error) {
        console.error(`[getmatch] Error fetching jobs from page ${page}:`, error);
        console.log(`[getmatch] Waiting for 10 seconds before retrying...`);
        await sleep(10000);
        continue;
      }

      const { offers } = searchData;

      console.log(`[getmatch] Fetched ${offers.length} offers from page ${page}.`);

      for (let i = 0; i < offers.length; i++) {
        const offer = offers[i];
        if (!offer) {
          console.warn(`[getmatch] Offer at index ${i} is undefined, skipping...`);
          continue;
        }
        let offerRes;
        let offerData: GetMatchOfferDetails;

        try {
          offerRes = await fetch(`${this.baseUrl}/api/offers/${offer.id}`, {
            headers: {
              ...this.fetchHeaders,
            },
          });

          offerData = (await offerRes.json()) as GetMatchOfferDetails;
        } catch (error) {
          console.error(
            `[getmatch] Error fetching job details for offer ID ${offer.id}:`,
            error,
          );
          console.log(`[getmatch] Waiting for 10 seconds before retrying...`);
          await sleep(10000);
          i = i - 1; // retry the same offer
          continue;
        }

        const location = offerData.location_requirements.filter((loc) => !loc.exclude)[0];
        const cheerioDescription = cheerio.load(offerData.description).text().trim();

        const job = this.normalize({
          id: String(offer.id),
          title: offer.position,
          companyName: offer.company.name,
          location: [location?.city, location?.country].filter(Boolean).join(', '),
          experience: this.extractExperience(offerData),
          workFormat: location?.format || 'any',
          salaryFrom: '',
          salaryTo: '',
          salaryExtra: '',
          description: cheerioDescription.slice(0, 1000),
          skills: offer.stack,
          postedAt: new Date(offer.published_at),
        });

        try {
          const insertedJob = await this.insertJob(job, String(offer.id));
          await shortenDescriptionQueue.add(
            'shorten-description',
            { jobId: insertedJob.id },
            { jobId: `shorten-job-${insertedJob.id}` },
          );
          count++;
        } catch (error) {
          console.error(
            `[getmatch] Error inserting/updating job in database for offer ID ${offer.id}:`,
            error,
          );
        }
      }
      page++;
    }
  }

  private async insertJob(normalizedJob: typeof jobs.$inferInsert, vacancyId: string) {
    const [insertedJob] = await db
      .insert(jobs)
      .values(normalizedJob)
      .onConflictDoUpdate({
        target: [jobs.source, jobs.externalId],
        set: {
          title: normalizedJob.title,
          companyName: normalizedJob.companyName,
          location: normalizedJob.location,
          experience: normalizedJob.experience,
          workFormat: normalizedJob.workFormat,
          salaryFrom: normalizedJob.salaryFrom,
          salaryTo: normalizedJob.salaryTo,
          salaryExtra: normalizedJob.salaryExtra,
          description: normalizedJob.description,
          skills: normalizedJob.skills,
          postedAt: normalizedJob.postedAt,
          fetchedAt: new Date(),
        },
      })
      .returning({ id: jobs.id, title: jobs.title });

    if (!insertedJob) {
      throw new Error(
        `Failed to insert/update job with vacancy ID ${vacancyId}. No job returned after upsert.`,
      );
    }

    console.log(
      `[getmatch] Inserted/Updated job in database for vacancy ID ${vacancyId} with job ID ${insertedJob.id}.`,
    );

    return insertedJob;
  }

  normalize(raw: RawJob): typeof jobs.$inferInsert {
    return {
      externalId: raw.id,
      source: 'getmatch',
      title: raw.title,
      companyName: raw.companyName,
      location: raw.location,
      experience: raw.experience,
      workFormat: [this.formatMap[raw.workFormat] || 'remote'],
      salaryFrom: raw.salaryFrom,
      salaryTo: raw.salaryTo,
      salaryExtra: raw.salaryExtra,
      description: raw.description,
      skills: raw.skills,
      postedAt: raw.postedAt,
      fetchedAt: new Date(),
    };
  }
}
