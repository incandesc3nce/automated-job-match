import { startMatchingWorker } from './features/matching/worker';
import { startShortenDescriptionWorker } from './features/shortenDescription/worker';
import { startVectorizeCvWorker } from './features/vectorizeCv/worker';
import { startVectorizeJobWorker } from './features/vectorizeJob/worker';
import { llm } from './providers/llm';

async function main() {
  const healthy = await llm.healthCheck();
  if (!healthy) {
    console.error(
      'LLM provider is not available. Please check the configuration and try again.',
    );
    process.exit(1);
  }

  const workers = [
    startShortenDescriptionWorker(),
    startVectorizeJobWorker(),
    startVectorizeCvWorker(),
    startMatchingWorker(),
  ];

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    await Promise.all(workers.map((worker) => worker.close()));
    console.log('All workers shut down. Exiting process.');
    process.exit(0);
  });

  console.log('LLM Worker started and healthy. Waiting for jobs...');
}

main();
