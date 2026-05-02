import type { Match } from './Match';
import { cvs, jobs } from '@career-ai/db';

export interface LLMProvider {
  generate(cv: typeof cvs.$inferSelect, job: typeof jobs.$inferSelect): Promise<Match>;
  embed(text: string): Promise<number[]>;
  healthCheck(): Promise<boolean>;
}
