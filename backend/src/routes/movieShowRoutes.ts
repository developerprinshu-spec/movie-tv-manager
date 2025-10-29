import { Router } from 'express';
import {
  createMovieShow,
  getMovieShows,
  getMovieShowById,
  updateMovieShow,
  deleteMovieShow
} from '../controllers/movieShowController';
import { validateRequest } from '../middleware/validation';
import { createMovieShowSchema, updateMovieShowSchema, querySchema } from '../validation/movieShow';

const router = Router();

// GET /api/movies-shows - Get all entries with pagination and search
router.get('/', validateRequest(querySchema, 'query'), getMovieShows);

// GET /api/movies-shows/:id - Get single entry by ID
router.get('/:id', getMovieShowById);

// POST /api/movies-shows - Create new entry
router.post('/', validateRequest(createMovieShowSchema, 'body'), createMovieShow);

// PUT /api/movies-shows/:id - Update entry
router.put('/:id', validateRequest(updateMovieShowSchema, 'body'), updateMovieShow);

// DELETE /api/movies-shows/:id - Delete entry
router.delete('/:id', deleteMovieShow);

export default router;
