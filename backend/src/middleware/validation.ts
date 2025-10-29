import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

type RequestLocation = 'body' | 'query' | 'params';

export const validateRequest = (schema: ZodSchema, location: RequestLocation = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[location];
      const validatedData = await schema.parseAsync(dataToValidate);
      
      // Replace request data with validated data
      req[location] = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      next(error);
    }
  };
};