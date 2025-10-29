import { mysqlTable, int, varchar, text, decimal, timestamp, boolean } from 'drizzle-orm/mysql-core';

export const moviesAndShows = mysqlTable('movies_and_shows', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'Movie' or 'TV Show'
  director: varchar('director', { length: 255 }).notNull(),
  budget: decimal('budget', { precision: 15, scale: 2 }),
  location: varchar('location', { length: 255 }),
  duration: int('duration'), // in minutes
  year: int('year'),
  timeRange: varchar('time_range', { length: 50 }), // for TV shows like "2008-2013"
  description: text('description'),
  rating: decimal('rating', { precision: 3, scale: 1 }), // 0.0 to 10.0
  genre: varchar('genre', { length: 100 }),
  status: varchar('status', { length: 50 }).default('completed'), // completed, ongoing, cancelled
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type MovieOrShow = typeof moviesAndShows.$inferSelect;
export type NewMovieOrShow = typeof moviesAndShows.$inferInsert;
