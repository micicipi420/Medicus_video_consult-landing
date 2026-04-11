import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  specialization: varchar('specialization', { length: 100 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('new'),
  dateCreated: timestamp('date_created', { withTimezone: true }).notNull().defaultNow(),
});
