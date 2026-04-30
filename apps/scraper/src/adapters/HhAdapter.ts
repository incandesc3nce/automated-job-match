import * as cheerio from 'cheerio';
import { JobSourceAdapter } from './JobSourceAdapter';
import type { RawJob } from '@/types/RawJob';

export class HhAdapter extends JobSourceAdapter {
  selectors = {
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

  private parsePostedAt(postedAtText: string): Date | null {
    const months: Record<string, number> = {
      января: 0,
      февраля: 1,
      марта: 2,
      апреля: 3,
      мая: 4,
      июня: 5,
      июля: 6,
      августа: 7,
      сентября: 8,
      октября: 9,
      ноября: 10,
      декабря: 11,
    };

    const parts = postedAtText.toLowerCase().split(' ');

    if (parts.length === 3) {
      const day = parseInt(parts[0] ?? 'null', 10);
      const month = months[parts[1] ?? 'null'];
      const year = parseInt(parts[2] ?? 'null', 10);

      if (month && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }

    return null;
  }

  async fetchJobs() {
    let page = 0;
    const vacancyIds: string[] = [];
    const resultJobs: RawJob[] = [];

    while (vacancyIds.length < 50) {
      console.log(`Fetching HH jobs from search...`);
      const searchRes = await fetch(
        `https://hh.ru/search/vacancy?${new URLSearchParams({ page: String(page) })}`,
        {
          headers: this.fetchHeaders,
        },
      );

      console.log(`Got status ${searchRes.status}, loading HTML...`);
      const searchHtml = await searchRes.text();
      const searchCheerio = cheerio.load(searchHtml);
      const searchJson = searchCheerio('#HH-Lux-InitialState').html();

      console.log(`Extracting vacancyIds from search results...`);
      const vacancyIdRegex = /"vacancyId":\s*(\d+)/g;
      if (searchJson) {
        let match;
        while ((match = vacancyIdRegex.exec(searchJson)) !== null) {
          if (match[1]) {
            vacancyIds.push(match[1]);
          }
        }
      }

      page++;
    }

    for (const id of vacancyIds) {
      console.log(`Fetching job details for vacancy ID ${id}...`);
      const jobRes = await fetch(`https://m.hh.ru/vacancy/${id}`, {
        headers: this.fetchHeaders,
      });

      const jobHtml = await jobRes.text();
      const jobCheerio = cheerio.load(jobHtml);

      const salary = this.extractSalary(jobCheerio(this.selectors.salary).text().trim());

      const rawJob: RawJob = {
        id,
        title: jobCheerio(this.selectors.title).text().trim(),
        experience: jobCheerio(this.selectors.experience).text().trim(),
        location: jobCheerio(this.selectors.location).text().trim().split(',')[0] ?? null,
        workFormat: jobCheerio(this.selectors.workFormats)
          .text()
          .trim()
          .replace('Формат работы: ', ''),
        companyName: jobCheerio(this.selectors.companyName).first().text().trim(),
        salaryFrom: salary.from,
        salaryTo: salary.to,
        salaryExtra: salary.extra,
        description: jobCheerio(this.selectors.description).text().trim(),
        skills: jobCheerio(this.selectors.skills)
          .map((_, el) => jobCheerio(el).text().trim())
          .get(),
        postedAt: this.parsePostedAt(
          jobCheerio(this.selectors.postedAt).first().find('span').text().trim(),
        ),
      };

      console.log(`Extracted job: ${rawJob.title} at ${rawJob.companyName}`);
      resultJobs.push(rawJob);
    }

    console.log(`Finished fetching HH jobs. Total jobs fetched: ${resultJobs.length}`);
    return resultJobs;
  }

  normalize(raw: RawJob) {
    return {
      source: 'hh',
      externalId: raw.id,
      title: raw.title,
      experience: raw.experience,
      location: raw.location,
      companyName: raw.companyName,
      workFormat: raw.workFormat,
      salaryFrom: raw.salaryFrom,
      salaryTo: raw.salaryTo,
      salaryExtra: raw.salaryExtra,
      description: raw.description,
      skills: raw.skills,
      postedAt: raw.postedAt,
      fetchedAt: new Date(),
    }
  }
}
