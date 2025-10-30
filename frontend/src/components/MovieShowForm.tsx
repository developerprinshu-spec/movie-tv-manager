import React from 'react';
import { useForm } from 'react-hook-form';
import { CreateMovieShowInput } from '@/types/movieShow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface MovieShowFormProps {
  initialData?: Partial<CreateMovieShowInput>;
  onSubmit: (data: CreateMovieShowInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const MovieShowForm: React.FC<MovieShowFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateMovieShowInput>({
    defaultValues: initialData,
  });

  const watchedType = watch('type');

  const handleFormSubmit = (data: CreateMovieShowInput) => {
    // Clean up NaN values from number inputs (happens when fields are empty)
    const cleanedData = {
      ...data,
      year: isNaN(data.year as any) ? undefined : data.year,
      duration: isNaN(data.duration as any) ? undefined : data.duration,
      rating: isNaN(data.rating as any) ? undefined : data.rating,
    };
    onSubmit(cleanedData as CreateMovieShowInput);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register('title', { required: 'Title is required' })}
            placeholder="Enter title"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={watchedType}
            onValueChange={(value) => setValue('type', value as 'Movie' | 'TV Show')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Movie">Movie</SelectItem>
              <SelectItem value="TV Show">TV Show</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>

        {/* Director */}
        <div className="space-y-2">
          <Label htmlFor="director">Director *</Label>
          <Input
            id="director"
            {...register('director', { required: 'Director is required' })}
            placeholder="Enter director name"
          />
          {errors.director && (
            <p className="text-sm text-destructive">{errors.director.message}</p>
          )}
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            {...register('budget')}
            placeholder="e.g., $160M"
          />
          {errors.budget && (
            <p className="text-sm text-destructive">{errors.budget.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register('location')}
            placeholder="e.g., LA, Paris"
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            {...register('duration', { valueAsNumber: true })}
            placeholder="e.g., 148"
          />
          {errors.duration && (
            <p className="text-sm text-destructive">{errors.duration.message}</p>
          )}
        </div>

        {/* Year */}
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            {...register('year', { valueAsNumber: true })}
            placeholder="e.g., 2010"
          />
          {errors.year && (
            <p className="text-sm text-destructive">{errors.year.message}</p>
          )}
        </div>

        {/* Time Range (for TV Shows) */}
        {watchedType === 'TV Show' && (
          <div className="space-y-2">
            <Label htmlFor="timeRange">Time Range</Label>
            <Input
              id="timeRange"
              {...register('timeRange')}
              placeholder="e.g., 2008-2013"
            />
            {errors.timeRange && (
              <p className="text-sm text-destructive">{errors.timeRange.message}</p>
            )}
          </div>
        )}

        {/* Genre */}
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input
            id="genre"
            {...register('genre')}
            placeholder="e.g., Action, Drama"
          />
          {errors.genre && (
            <p className="text-sm text-destructive">{errors.genre.message}</p>
          )}
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-10)</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="10"
            {...register('rating', { valueAsNumber: true })}
            placeholder="e.g., 8.5"
          />
          {errors.rating && (
            <p className="text-sm text-destructive">{errors.rating.message}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value as 'completed' | 'ongoing' | 'cancelled')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter description"
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};
