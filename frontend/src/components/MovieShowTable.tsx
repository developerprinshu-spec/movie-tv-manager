import React, { useState, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { MovieOrShow } from '@/types/movieShow';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Eye } from 'lucide-react';

interface MovieShowTableProps {
  entries: MovieOrShow[];
  onEdit: (entry: MovieOrShow) => void;
  onDelete: (id: number) => void;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
}

export const MovieShowTable: React.FC<MovieShowTableProps> = ({
  entries,
  onEdit,
  onDelete,
  onLoadMore,
  hasNextPage,
  isLoading,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isLoading, onLoadMore]);

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const formatBudget = (budget: string | null) => {
    if (!budget) return 'N/A';
    return budget;
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return 'N/A';
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const formatYear = (year: number | null, timeRange: string | null) => {
    if (timeRange) return timeRange;
    if (year) return year.toString();
    return 'N/A';
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Year/Time</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  <div className="max-w-[200px]">
                    <p className="truncate" title={entry.title}>
                      {entry.title}
                    </p>
                    {entry.genre && (
                      <p className="text-sm text-muted-foreground">
                        {entry.genre}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      entry.type === 'Movie'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {entry.type}
                  </span>
                </TableCell>
                <TableCell className="max-w-[150px]">
                  <p className="truncate" title={entry.director}>
                    {entry.director}
                  </p>
                </TableCell>
                <TableCell>{formatBudget(entry.budget)}</TableCell>
                <TableCell className="max-w-[100px]">
                  <p className="truncate" title={entry.location || ''}>
                    {entry.location || 'N/A'}
                  </p>
                </TableCell>
                <TableCell>{formatDuration(entry.duration)}</TableCell>
                <TableCell>{formatYear(entry.year, entry.timeRange)}</TableCell>
                <TableCell>
                  {entry.rating ? (
                    <span className="font-medium">{entry.rating}/10</span>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      entry.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : entry.status === 'ongoing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {entry.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Load More Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Loading more...</span>
            </div>
          ) : (
            <Button variant="outline" onClick={onLoadMore}>
              Load More
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this entry? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
