import { pgTable, serial, text, date, timestamp, boolean } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  date: date('date').notNull(),
  time: text('time').notNull(), 
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;