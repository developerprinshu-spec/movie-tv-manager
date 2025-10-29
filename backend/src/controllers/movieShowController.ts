import { Request, Response } from 'express';
import { db } from '../db/connection';
import { moviesAndShows } from '../db/schema';
import { eq, like, and, desc, count, or } from 'drizzle-orm';
import { CreateMovieShowInput, UpdateMovieShowInput, QueryParams } from '../validation/movieShow';

export const createMovieShow = async (req: Request, res: Response) => {
  try {
    const data: CreateMovieShowInput = req.body;

    // Map all fields properly
    const processedData: any = {
      title: data.title,
      type: data.type,
      director: data.director,
      budget: data.budget ? String(data.budget) : null,
      location: data.location || null,
      duration: data.duration || null,
      year: data.year || null,
      timeRange: data.timeRange || null,
      description: data.description || null,
      rating: data.rating ? String(data.rating) : null,
      genre: data.genre || null,
      status: data.status || 'completed',
    };

    const [newEntry] = await db.insert(moviesAndShows).values(processedData);

    // Fetch the created entry
    const [createdEntry] = await db
      .select()
      .from(moviesAndShows)
      .where(eq(moviesAndShows.id, newEntry.insertId));

    res.status(201).json({
      success: true,
      data: createdEntry,
      message: 'Entry created successfully'
    });
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getMovieShows = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, type } = req.query as any;

    const pageNum = parseInt(String(page)) || 1;
    const limitNum = parseInt(String(limit)) || 10;
    const offset = (pageNum - 1) * limitNum;

    // Build where conditions
    const whereConditions: any[] = [];

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchTerm = search.trim();
      whereConditions.push(
        or(
          like(moviesAndShows.title, `%${searchTerm}%`),
          like(moviesAndShows.director, `%${searchTerm}%`),
          like(moviesAndShows.genre, `%${searchTerm}%`)
        )
      );
    }

    if (type && (type === 'Movie' || type === 'TV Show')) {
      whereConditions.push(eq(moviesAndShows.type, type));
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(moviesAndShows)
      .where(whereClause);

    const total = Number(totalResult.count);

    // Get paginated results
    const entries = await db
      .select()
      .from(moviesAndShows)
      .where(whereClause)
      .orderBy(desc(moviesAndShows.createdAt))
      .limit(limitNum)
      .offset(offset);

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
          hasNext: pageNum * limitNum < total,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entries',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getMovieShowById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entryId = parseInt(id, 10);

    if (isNaN(entryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entry ID'
      });
    }

    const [entry] = await db
      .select()
      .from(moviesAndShows)
      .where(eq(moviesAndShows.id, entryId));

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateMovieShow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entryId = parseInt(id, 10);
    const data: UpdateMovieShowInput = req.body;

    if (isNaN(entryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entry ID'
      });
    }

    // Check if entry exists
    const [existingEntry] = await db
      .select()
      .from(moviesAndShows)
      .where(eq(moviesAndShows.id, entryId));

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    // Process data - map all fields properly
    const processedData: any = {};

    if (data.title !== undefined) processedData.title = data.title;
    if (data.type !== undefined) processedData.type = data.type;
    if (data.director !== undefined) processedData.director = data.director;
    if (data.budget !== undefined) processedData.budget = data.budget ? String(data.budget) : null;
    if (data.location !== undefined) processedData.location = data.location || null;
    if (data.duration !== undefined) processedData.duration = data.duration || null;
    if (data.year !== undefined) processedData.year = data.year || null;
    if (data.timeRange !== undefined) processedData.timeRange = data.timeRange || null;
    if (data.description !== undefined) processedData.description = data.description || null;
    if (data.rating !== undefined) processedData.rating = data.rating ? String(data.rating) : null;
    if (data.genre !== undefined) processedData.genre = data.genre || null;
    if (data.status !== undefined) processedData.status = data.status;

    await db
      .update(moviesAndShows)
      .set(processedData)
      .where(eq(moviesAndShows.id, entryId));

    // Fetch updated entry
    const [updatedEntry] = await db
      .select()
      .from(moviesAndShows)
      .where(eq(moviesAndShows.id, entryId));

    res.json({
      success: true,
      data: updatedEntry,
      message: 'Entry updated successfully'
    });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteMovieShow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const entryId = parseInt(id, 10);

    if (isNaN(entryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid entry ID'
      });
    }

    // Check if entry exists
    const [existingEntry] = await db
      .select()
      .from(moviesAndShows)
      .where(eq(moviesAndShows.id, entryId));

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    await db
      .delete(moviesAndShows)
      .where(eq(moviesAndShows.id, entryId));

    res.json({
      success: true,
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete entry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};