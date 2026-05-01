import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env['DB_URL']!;

const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });
export * from './schema';
export * from 'drizzle-orm';
