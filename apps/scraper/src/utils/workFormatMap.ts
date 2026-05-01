import type { jobs } from '@career-ai/db';

export const workFormatMap: Record<
  string,
  (typeof jobs.$inferInsert.workFormat)[number]
> = {
  удалённо: 'remote',
  гибрид: 'hybrid',
  'на месте работодателя': 'onsite',
  разъездной: 'traveling',
} as const;
