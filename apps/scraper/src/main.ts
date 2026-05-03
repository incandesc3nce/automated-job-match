import { db, jobs } from '@career-ai/db';
import { HhAdapter } from './adapters/HhAdapter';
import { cron } from 'bun';
import { vectorizeJobQueue } from '@career-ai/queue';

const hhAdapter = new HhAdapter();

cron('0 0 * * *', async () => {
  console.log('Starting hh scraping flow...');
  const startTime = Date.now();
  try {
    const normalizedJobs = await hhAdapter.flow();
    console.log(
      `hh scraping flow completed. Total unique jobs fetched: ${normalizedJobs.length}`,
    );
    console.log(`Inserting ${normalizedJobs.length} jobs into the database...`);
    const insertedJobs = await db
      .insert(jobs)
      .values([...normalizedJobs.values()])
      .onConflictDoUpdate({
        target: [jobs.source, jobs.externalId],
        set: {
          title: jobs.title,
          companyName: jobs.companyName,
          location: jobs.location,
          experience: jobs.experience,
          workFormat: jobs.workFormat,
          salaryFrom: jobs.salaryFrom,
          salaryTo: jobs.salaryTo,
          salaryExtra: jobs.salaryExtra,
          description: jobs.description,
          skills: jobs.skills,
          fetchedAt: new Date(),
        },
      })
      .returning({ id: jobs.id });
    console.log('hh Jobs inserted/updated successfully');

    console.log('Adding vectorization jobs to the queue...');
    await vectorizeJobQueue.addBulk(
      insertedJobs.map((job) => ({
        name: 'vectorize-job',
        data: { jobId: job.id },
        options: { jobId: `vectorize-job-${job.id}` },
      })),
    );
    console.log('Vectorization jobs added to the queue successfully');
  } catch (error) {
    console.error('Error during HH scraping flow:', error);
  } finally {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`hh scraping flow finished in ${duration} seconds.`);
  }
});

console.log('Scraper service started. Waiting for scheduled tasks...');
