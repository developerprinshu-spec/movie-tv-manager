import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MovieShowForm } from '@/components/MovieShowForm';
import { MovieShowTable } from '@/components/MovieShowTable';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { useMovieShows } from '@/hooks/useMovieShows';
import { CreateMovieShowInput, MovieOrShow } from '@/types/movieShow';
import { Plus, Film } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'Movie' | 'TV Show' | ''>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MovieOrShow | null>(null);

  const {
    entries,
    isLoading,
    hasNextPage,
    loadMore,
    createEntry,
    updateEntry,
    deleteEntry,
    isCreating,
    isUpdating,
  } = useMovieShows({
    search: search || undefined,
    type: (type as 'Movie' | 'TV Show') || undefined,
  });

  const handleCreate = async (data: CreateMovieShowInput) => {
    try {
      await createEntry(data);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating entry:', error);
    }
  };

  const handleEdit = (entry: MovieOrShow) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleUpdate = async (data: CreateMovieShowInput) => {
    if (!editingEntry) return;

    try {
      await updateEntry({ id: editingEntry.id, data });
      setIsFormOpen(false);
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      await deleteEntry(id);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleTypeChange = (value: string) => {
    setType(value as 'Movie' | 'TV Show' | '');
  };

  const handleClearFilters = () => {
    setSearch('');
    setType('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Film className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Movie & TV Show Manager
              </h1>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Entry
            </Button>
          </div>
          <p className="text-gray-600 mt-2">
            Manage your favorite movies and TV shows with detailed information
          </p>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          search={search}
          type={type}
          onSearchChange={setSearch}
          onTypeChange={handleTypeChange}
          onClear={handleClearFilters}
        />

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <MovieShowTable
            entries={entries}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLoadMore={loadMore}
            hasNextPage={hasNextPage || false}
            isLoading={isLoading}
          />
        </div>

        {/* Empty State */}
        {!isLoading && entries.length === 0 && (
          <div className="text-center py-12">
            <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No entries found
            </h3>
            <p className="text-gray-500 mb-4">
              {search || type
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first movie or TV show.'}
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Entry
            </Button>
          </div>
        )}

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? 'Edit Entry' : 'Add New Entry'}
              </DialogTitle>
            </DialogHeader>
            <MovieShowForm
              initialData={editingEntry ? {
                title: editingEntry.title,
                type: editingEntry.type,
                director: editingEntry.director,
                budget: editingEntry.budget || undefined,
                location: editingEntry.location || undefined,
                duration: editingEntry.duration || undefined,
                year: editingEntry.year || undefined,
                timeRange: editingEntry.timeRange || undefined,
                description: editingEntry.description || undefined,
                rating: editingEntry.rating || undefined,
                genre: editingEntry.genre || undefined,
                status: editingEntry.status,
              } : undefined}
              onSubmit={editingEntry ? handleUpdate : handleCreate}
              onCancel={handleFormClose}
              isLoading={isCreating || isUpdating}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;