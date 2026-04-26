import app from './app';

const port = process.env['PORT'] ? Number(process.env['PORT']) : 5000;

console.log(`🔥 Server is running at http://localhost:${port}`);

export default {
  port,
  hostname: '0.0.0.0',
  fetch: app.fetch,
};
