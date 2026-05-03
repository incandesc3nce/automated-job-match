import * as cheerio from 'cheerio';
import { jobs } from '@career-ai/db';
import { JobSourceAdapter } from './JobSourceAdapter';
import type { RawJob } from '@/types/RawJob';
import { workFormatMap } from '@/utils/workFormatMap';
import { sleep } from '@/utils/sleep';

export class HhAdapter extends JobSourceAdapter {
  selectors = {
    basicInfo: '[type="application/ld+json"]',
    title: '[data-qa="vacancy-title"]',
    experience: '[data-qa="vacancy-experience"]',
    location: '[data-qa="vacancy-view-raw-address"]',
    workFormats: '[data-qa="work-formats-text"]',
    companyName: '[data-qa="vacancy-company-name"]',
    salary: '[data-qa="vacancy-salary"]',
    description: '[data-qa="vacancy-description"]',
    skills: '[data-qa="skills-element"]',
    postedAt: 'div:contains("Вакансия опубликована")',
  };

  private extractSalary(salaryText: string) {
    let from = null;
    let to = null;
    let extra = null;

    const salaryMatch = salaryText.match(
      /(?:от\s*)?([\d\s]+)?\s*(?:до\s*|[-–]\s*)?([\d\s]+)?\s*(.+)/i,
    );

    if (salaryMatch) {
      from = salaryMatch[1] ? salaryMatch[1].replace(/\s/g, '') : null;
      to = salaryMatch[2] ? salaryMatch[2].replace(/\s/g, '') : null;
      extra = salaryMatch[3] ? salaryMatch[3].trim() : null;
    }

    // Handle edge cases where "до" appears without "от"
    if (salaryText.toLowerCase().startsWith('до ') && !to && from) {
      to = from;
      from = null;
    }

    return {
      from,
      to,
      extra,
    };
  }

  private mapWorkFormat(workFormat: string) {
    const formats = workFormat
      .toLowerCase()
      .replace('или', ',')
      .split(',')
      .map((f) => f.trim());
    return formats.map((format) => workFormatMap[format] || 'any');
  }

  async fetchJobs() {
    let page = 0;
    const vacancyIds: string[] = [];
    const resultJobs: RawJob[] = [];

    // TODO: change length or dynamically determine how many jobs to fetch based on how many are already in the database
    while (vacancyIds.length < 100) {
      console.log(`[hh] Fetching jobs from search...`);
      const searchRes = await fetch(
        `https://hh.ru/search/vacancy?${new URLSearchParams({ page: String(page) })}`,
        {
          headers: this.fetchHeaders,
        },
      );

      console.log(`[hh] Got status ${searchRes.status}, loading HTML...`);
      const searchHtml = await searchRes.text();
      const searchCheerio = cheerio.load(searchHtml);
      const searchJson = searchCheerio('#HH-Lux-InitialState').html();

      console.log(`[hh] Extracting vacancyIds from search results...`);
      const vacancyIdRegex = /"vacancyId":\s*(\d+)/g;
      if (searchJson) {
        let match;
        while ((match = vacancyIdRegex.exec(searchJson)) !== null) {
          if (match[1]) {
            vacancyIds.push(match[1]);
          }
        }
      }

      console.log(`[hh] Extracted ${vacancyIds.length} vacancy IDs so far...`);
      console.log(`[hh] Waiting before fetching next page...`);
      await sleep(3); // add delay between page requests to avoid rate limiting
      page++;
    }

    for (const id of vacancyIds) {
      console.log(`[hh] Fetching job details for vacancy ID ${id}...`);
      const jobRes = await fetch(`https://m.hh.ru/vacancy/${id}`, {
        headers: this.fetchHeaders,
      });

      const jobHtml = await jobRes.text();
      const jobCheerio = cheerio.load(jobHtml);

      const salary = this.extractSalary(jobCheerio(this.selectors.salary).text().trim());
      let title = '';
      let location = '';
      let companyName = '';
      let postedAt: Date | null = null;
      try {
        const basicInfo = jobCheerio(this.selectors.basicInfo).text().trim();
        const basicInfoJson = JSON.parse(basicInfo);
        title = basicInfoJson.title || '';
        location = basicInfoJson.jobLocation.address.addressLocality || '';
        companyName = basicInfoJson.hiringOrganization.name || '';
        postedAt = basicInfoJson.datePosted ? new Date(basicInfoJson.datePosted) : null;
      } catch (error) {
        console.error(`Error extracting basic info for vacancy ID ${id}:`, error);

        // fallback to regex extraction method
        title =
          jobCheerio(this.selectors.title).text().trim() ||
          /"title": "([^"]+)"/.exec(jobHtml)?.[1] ||
          '';
        location =
          jobCheerio(this.selectors.location).text().trim().split(',')[0] ||
          /"addressLocality": "([^"]+)"/.exec(jobHtml)?.[1] ||
          '';
        companyName =
          jobCheerio(this.selectors.companyName).text().trim() ||
          /"hiringOrganization":\s*{\s*"name": "([^"]+)"/.exec(jobHtml)?.[1] ||
          '';
      }

      const rawJob: RawJob = {
        id,
        title,
        experience: jobCheerio(this.selectors.experience).text().trim(),
        location,
        workFormat: jobCheerio(this.selectors.workFormats)
          .text()
          .trim()
          .replace('Формат работы: ', '')
          .split('·')[0]!,
        companyName,
        salaryFrom: salary.from,
        salaryTo: salary.to,
        salaryExtra: salary.extra,
        description: jobCheerio(this.selectors.description).text().trim(),
        skills: jobCheerio(this.selectors.skills)
          .map((_, el) => jobCheerio(el).text().trim())
          .get(),
        postedAt,
      };

      console.log(`[hh] Extracted job: ${rawJob.title} at ${rawJob.companyName}`);
      if (!rawJob.title || !rawJob.companyName) {
        console.warn(`[hh] Skipping job with missing title or company name. Vacancy ID: ${id}`);
        await sleep(10); // add delay before next request
        // TODO: retry failed job fetch
        continue;
      }
      resultJobs.push(rawJob);
    }

    console.log(`[hh] Finished fetching jobs. Total jobs fetched: ${resultJobs.length}`);
    return resultJobs;
  }

  normalize(raw: RawJob): typeof jobs.$inferInsert {
    return {
      externalId: raw.id,
      source: 'hh',
      title: raw.title,
      companyName: raw.companyName,
      location: raw.location,
      experience: raw.experience,
      workFormat: this.mapWorkFormat(raw.workFormat),
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
