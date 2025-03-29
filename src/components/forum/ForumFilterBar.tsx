
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search,
  PlusCircle,
  FilterX,
  TrendingUp,
  MessageSquareText, 
  Filter,
  Medal,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ForumFilterBarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  openNewTopicDialog: () => void;
  openLeaderboardModal: () => void;
  onSearch: (term: string) => void;
  searchTerm?: string;
  isSearching?: boolean;
  onTagSearch?: () => void;
}

const ForumFilterBar = ({
  activeFilter,
  setActiveFilter,
  selectedSpecialty,
  setSelectedSpecialty,
  openNewTopicDialog,
  openLeaderboardModal,
  onSearch,
  searchTerm = '',
  isSearching = false,
  onTagSearch
}: ForumFilterBarProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // Update local search term when the prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
    if (onTagSearch) {
      onTagSearch();
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                <Filter className="h-4 w-4 mr-2" />
                All
              </Button>
              <Button
                variant={activeFilter === 'trending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('trending')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </Button>
              <Button
                variant={activeFilter === 'unanswered' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('unanswered')}
              >
                <MessageSquareText className="h-4 w-4 mr-2" />
                Unanswered
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={openLeaderboardModal}
              >
                <Medal className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
              <Button
                onClick={openNewTopicDialog}
                size="sm"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Topic
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search topics or tags..."
                    className="pl-8"
                    value={localSearchTerm}
                    onChange={(e) => {
                      setLocalSearchTerm(e.target.value);
                      if (e.target.value === '') {
                        onSearch('');
                      }
                    }}
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
              </form>
            </div>
            
            <div className="flex-shrink-0 w-full sm:w-48">
              <Select
                value={selectedSpecialty}
                onValueChange={setSelectedSpecialty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Oncology">Oncology</SelectItem>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                  <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                  <SelectItem value="Infectious Disease">Infectious Disease</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ForumFilterBar;
