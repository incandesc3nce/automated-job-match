import app from './app';

const port = process.env['PORT'] ? Number(process.env['PORT']) : 5000;

export default {
  port,
  hostname: '0.0.0.0',
  fetch: app.fetch,
};
