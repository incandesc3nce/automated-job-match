import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

const id = uuid('id').defaultRandom().primaryKey();
const createdAt = timestamp('created_at').defaultNow().notNull();
const updatedAt = timestamp('updated_at')
  .defaultNow()
  .notNull()
  .$onUpdate(() => new Date());

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
}));

// TODO: add fields
export const cvs = pgTable('cvs', {
  id: id,
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  experienceMonths: integer('experience_months').notNull(),
  skills: varchar('skills', { length: 100 }).array().notNull(),
  workFormat: varchar('work_format', {
    length: 20,
    enum: ['any', 'remote', 'hybrid', 'onsite'],
  }).notNull(),
  createdAt: createdAt,
  updatedAt: updatedAt,
});

export const cvsRelations = relations(cvs, ({ one }) => ({
  user: one(users, {
    fields: [cvs.userId],
    references: [users.id],
  }),
}));

// TODO: review fields, maybe they would require an update after other scrapers are written
export const jobs = pgTable('jobs', {
  id: id,
  source: varchar('source', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  experience: varchar('experience', { length: 255 }).notNull(),
  workFormat: varchar('work_format', {
    length: 20,
    enum: ['remote', 'hybrid', 'onsite'],
  }).notNull(),
  salaryFrom: varchar('salary_from', { length: 50 }),
  salaryTo: varchar('salary_to', { length: 50 }),
  salaryExtra: varchar('salary_extra', { length: 255 }),
  description: varchar('description', { length: 5000 }).notNull(),
  skills: varchar('skills', { length: 255 }).array().notNull(),
  postedAt: timestamp('posted_at'),
  fetchedAt: timestamp('fetched_at').defaultNow().notNull(),
  createdAt: createdAt,
  embeddingStatus: varchar('embedding_status', {
    length: 20,
    enum: ['pending', 'completed', 'failed'],
  })
    .default('pending')
    .notNull(),
  hidden: boolean('hidden').default(false).notNull(),
});

// TODO: add fields
export const matches = pgTable('matches', {
  id: id,
});
