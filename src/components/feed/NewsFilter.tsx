
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, RefreshCw } from 'lucide-react';

interface NewsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  specialty: string | 'all';
  setSpecialty: (specialty: string) => void;
  sortOrder: 'newest' | 'oldest';
  setSortOrder: (order: 'newest' | 'oldest') => void;
  handleRefresh: () => void;
  isLoading: boolean;
  isRefreshing: boolean;
  specialties: string[];
}

const NewsFilter = ({
  searchQuery,
  setSearchQuery,
  specialty,
  setSpecialty,
  sortOrder,
  setSortOrder,
  handleRefresh,
  isLoading,
  isRefreshing,
  specialties
}: NewsFilterProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search articles by title, content, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {specialties.map(spec => (
              <option key={spec} value={spec}>
                {spec === 'all' ? 'All Specialties' : spec}
              </option>
            ))}
          </select>
          
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            title={`Sort by ${sortOrder === 'newest' ? 'oldest' : 'newest'} first`}
          >
            <ArrowUpDown size={16} />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            title="Refresh news feed"
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsFilter;
