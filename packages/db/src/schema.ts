import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  text,
  vector,
  index,
  real,
} from 'drizzle-orm/pg-core';

const id = uuid('id').defaultRandom().primaryKey();
const createdAt = timestamp('created_at').defaultNow().notNull();
const updatedAt = timestamp('updated_at')
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date());

const workFormat = varchar('work_format', {
  length: 20,
  enum: ['any', 'remote', 'hybrid', 'onsite', 'traveling'],
});

export const users = pgTable('users', {
  id: id,
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export const usersRelations = relations(users, ({ many }) => ({
  cvs: many(cvs),
  matches: many(matches),
}));

// TODO: add fields
export const cvs = pgTable(
  'cvs',
  {
    id: id,
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    title: varchar('title', { length: 255 }).notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    experienceMonths: integer('experience_months').notNull(),
    skills: varchar('skills', { length: 100 }).array().notNull(),
    workFormat: workFormat.notNull(),
    embeddings: vector('embeddings', { dimensions: 1024 }),
    createdAt: createdAt,
    updatedAt: updatedAt,
  },
  (table) => [
    index('idx_cvs_embeddings').using('hnsw', table.embeddings.op('vector_cosine_ops')),
  ],
);

export const cvsRelations = relations(cvs, ({ one }) => ({
  user: one(users, {
    fields: [cvs.userId],
    references: [users.id],
  }),
}));

// TODO: review fields, maybe they would require an update after other scrapers are written
export const jobs = pgTable(
  'jobs',
  {
    id: id,
    externalId: varchar('external_id', { length: 255 }).notNull(),
    source: varchar('source', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    companyName: varchar('company_name', { length: 255 }).notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    experience: varchar('experience', { length: 255 }).notNull(),
    workFormat: workFormat.array().notNull(),
    salaryFrom: varchar('salary_from', { length: 50 }),
    salaryTo: varchar('salary_to', { length: 50 }),
    salaryExtra: varchar('salary_extra', { length: 255 }),
    description: text('description').notNull(),
    shortDescription: text('short_description'),
    embeddings: vector('embeddings', { dimensions: 1024 }),
    skills: varchar('skills', { length: 255 }).array().notNull(),
    postedAt: timestamp('posted_at'),
    fetchedAt: timestamp('fetched_at').defaultNow().notNull(),
    embeddingStatus: varchar('embedding_status', {
      length: 20,
      enum: ['pending', 'completed', 'failed'],
    })
      .default('pending')
      .notNull(),
    hidden: boolean('hidden').default(false).notNull(),
  },
  (table) => [
    uniqueIndex('unique_external_id_per_source').on(table.source, table.externalId),
    index('idx_jobs_embeddings').using('hnsw', table.embeddings.op('vector_cosine_ops')),
  ],
);

// TODO: review field if needed
export const matches = pgTable('matches', {
  id: id,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  cvId: uuid('cv_id')
    .notNull()
    .references(() => cvs.id),
  jobId: uuid('job_id')
    .notNull()
    .references(() => jobs.id),
  score: integer('score').notNull(),
  reasoning: text('reasoning').notNull(),
  similarity: real('similarity').notNull(),
  matchedSkills: varchar('matched_skills', { length: 255 }).array().notNull(),
  missingSkills: varchar('missing_skills', { length: 255 }).array().notNull(),
  hidden: boolean('hidden').default(false).notNull(),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export const matchesRelations = relations(matches, ({ one }) => ({
  user: one(users, {
    fields: [matches.userId],
    references: [users.id],
  }),
  cv: one(cvs, {
    fields: [matches.cvId],
    references: [cvs.id],
  }),
  job: one(jobs, {
    fields: [matches.jobId],
    references: [jobs.id],
  }),
}));
