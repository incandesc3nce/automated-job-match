import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

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

// TODO: add fields
export const jobs = pgTable('jobs', {
  id: id,
});

// TODO: add fields
export const matches = pgTable('matches', {
  id: id,
});
