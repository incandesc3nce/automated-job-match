import { GetMatchAdapter } from './adapters/GetMatchAdapter';
import { HhAdapter } from './adapters/HhAdapter';
import { cron } from 'bun';

const hhFlow = async () => {
  const hhAdapter = new HhAdapter();
  console.log('Starting hh scraping flow...');
  const startTime = Date.now();
  try {
    await hhAdapter.fetchJobs();
  } catch (error) {
    console.error('Error during HH scraping flow:', error);
  } finally {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`hh scraping flow finished in ${duration} seconds.`);
  }
};

const getMatchFlow = async () => {
  const getMatchAdapter = new GetMatchAdapter();
  console.log('Starting GetMatch scraping flow...');
  const startTime = Date.now();
  try {
    await getMatchAdapter.fetchJobs();
  } catch (error) {
    console.error('Error during GetMatch scraping flow:', error);
  } finally {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`GetMatch scraping flow finished in ${duration} seconds.`);
  }
};

console.log('Scraper service started. Waiting for scheduled tasks...');

cron('0 0 * * *', async () => {
  await Promise.all([hhFlow(), getMatchFlow()]);
});
