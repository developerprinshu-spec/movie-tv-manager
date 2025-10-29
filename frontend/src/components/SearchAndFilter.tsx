import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchAndFilterProps {
  search: string;
  type: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClear: () => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  search,
  type,
  onSearchChange,
  onTypeChange,
  onClear,
}) => {
  const hasFilters = search || type;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="w-full sm:w-48">
        <Select value={type || "all"} onValueChange={(value) => onTypeChange(value === "all" ? "" : value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Movie">Movie</SelectItem>
            <SelectItem value="TV Show">TV Show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={onClear}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
};
