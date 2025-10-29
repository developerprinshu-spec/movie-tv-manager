import axios from 'axios';
import { 
  MovieOrShow, 
  CreateMovieShowInput, 
  UpdateMovieShowInput, 
  ApiResponse, 
  PaginatedResponse, 
  QueryParams 
} from '@/types/movieShow';

// Use environment variable for production, fallback to proxy in development
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Helper function to transform data for backend
const transformDataForBackend = (data: CreateMovieShowInput | UpdateMovieShowInput) => {
  const transformed: any = { ...data };
  
  // Convert rating to string if it's a number
  if (transformed.rating !== undefined && transformed.rating !== null) {
    transformed.rating = String(transformed.rating);
  }
  
  // Convert budget to string if needed
  if (transformed.budget !== undefined && transformed.budget !== null) {
    transformed.budget = String(transformed.budget);
  }
  
  return transformed;
};

export const movieShowApi = {
  // Get all movies/shows with pagination and search
  getAll: async (params: QueryParams = {}): Promise<ApiResponse<PaginatedResponse>> => {
    const response = await api.get('/movies-shows', { params });
    return response.data;
  },

  // Get single movie/show by ID
  getById: async (id: number): Promise<ApiResponse<MovieOrShow>> => {
    const response = await api.get(`/movies-shows/${id}`);
    return response.data;
  },

  // Create new movie/show
  create: async (data: CreateMovieShowInput): Promise<ApiResponse<MovieOrShow>> => {
    console.log('Creating entry with data:', data);
    const transformedData = transformDataForBackend(data);
    console.log('Transformed data:', transformedData);
    const response = await api.post('/movies-shows', transformedData);
    console.log('Create response:', response.data);
    return response.data;
  },

  // Update movie/show
  update: async (id: number, data: UpdateMovieShowInput): Promise<ApiResponse<MovieOrShow>> => {
    console.log('Updating entry', id, 'with data:', data);
    const transformedData = transformDataForBackend(data);
    const response = await api.put(`/movies-shows/${id}`, transformedData);
    console.log('Update response:', response.data);
    return response.data;
  },

  // Delete movie/show
  delete: async (id: number): Promise<ApiResponse<void>> => {
    console.log('Deleting entry:', id);
    const response = await api.delete(`/movies-shows/${id}`);
    console.log('Delete response:', response.data);
    return response.data;
  },
};

export default api;