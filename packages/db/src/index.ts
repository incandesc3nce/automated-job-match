import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const connectionString = process.env['DB_URL']!;

export const db = drizzle(connectionString, { schema });
export * from './schema';
export { eq, lt, lte, gt, gte, ne } from 'drizzle-orm';
