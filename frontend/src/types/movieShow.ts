export interface MovieOrShow {
  id: number;
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  budget: string | null;
  location: string | null;
  duration: number | null;
  year: number | null;
  timeRange: string | null;
  description: string | null;
  rating: number | null;
  genre: string | null;
  status: 'completed' | 'ongoing' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieShowInput {
  title: string;
  type: 'Movie' | 'TV Show';
  director: string;
  budget?: string;
  location?: string;
  duration?: number;
  year?: number;
  timeRange?: string;
  description?: string;
  rating?: number;
  genre?: string;
  status?: 'completed' | 'ongoing' | 'cancelled';
}

export interface UpdateMovieShowInput extends Partial<CreateMovieShowInput> {}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse {
  entries: MovieOrShow[];
  pagination: PaginationInfo;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'Movie' | 'TV Show';
}
