import { z } from 'zod';

export const createMovieShowSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  type: z.enum(['Movie', 'TV Show'], {
    errorMap: () => ({ message: 'Type must be either Movie or TV Show' })
  }),
  director: z.string().min(1, 'Director is required').max(255, 'Director name too long'),
  budget: z.string().optional().refine((val) => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, 'Budget must be a valid positive number'),
  location: z.string().max(255, 'Location too long').optional(),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute').optional().nullable(),
  year: z.number().int().min(1800, 'Year must be after 1800').max(new Date().getFullYear() + 10, 'Year cannot be too far in the future').optional().nullable(),
  timeRange: z.string().max(50, 'Time range too long').optional(),
  description: z.string().optional(),
  rating: z.union([
    z.number().min(0, 'Rating cannot be negative').max(10, 'Rating cannot exceed 10'),
    z.string().refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 10;
    }, 'Rating must be between 0 and 10')
  ]).optional(),
  genre: z.string().max(100, 'Genre too long').optional(),
  status: z.enum(['completed', 'ongoing', 'cancelled']).optional(),
});

export const updateMovieShowSchema = createMovieShowSchema.partial();

export const querySchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
  search: z.string().optional(),
  type: z.enum(['Movie', 'TV Show']).optional(),
});

export type CreateMovieShowInput = z.infer<typeof createMovieShowSchema>;
export type UpdateMovieShowInput = z.infer<typeof updateMovieShowSchema>;
export type QueryParams = z.infer<typeof querySchema>;
