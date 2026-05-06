import { GetMatchAdapter } from './adapters/GetMatchAdapter';
import { HhAdapter } from './adapters/HhAdapter';
import { cron } from 'bun';
import type { JobSourceAdapter } from './adapters/JobSourceAdapter';

const flow = async (adapter: new () => JobSourceAdapter, source: string) => {
  const scraper = new adapter();
  console.log(`Starting ${source} scraping flow...`);
  const startTime = Date.now();
  try {
    await scraper.fetchJobs();
  } catch (error) {
    console.error(`Error during ${source} scraping flow:`, error);
  } finally {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`${source} scraping flow finished in ${duration} seconds.`);
  }
};

const startFlows = async () => {
  await Promise.all([flow(HhAdapter, 'hh'), flow(GetMatchAdapter, 'getmatch')]);
};

console.log('Scraper service started. Waiting for scheduled tasks...');

cron('0 0 * * *', async () => {
  await startFlows();
});

// Run immediately on startup in prod
if (process.env.NODE_ENV === 'production') {
  console.log('Running scraping flows immediately on startup...');
  startFlows();
}
