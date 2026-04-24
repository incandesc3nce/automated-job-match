import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env['DB_URL']!;
const client = postgres(connectionString);

export const db = drizzle(client, { schema });
export * from './schema';
export { eq, lt, lte, gt, gte, ne, and, or, sql, asc, desc } from 'drizzle-orm';
