
import { BookOpen, Globe, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsCategoryFilterProps {
  activeFilter: 'all' | 'journals' | 'news' | 'research';
  setActiveFilter: (filter: 'all' | 'journals' | 'news' | 'research') => void;
}

const NewsCategoryFilter = ({ activeFilter, setActiveFilter }: NewsCategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        size="sm" 
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        onClick={() => setActiveFilter('all')}
      >
        All
      </Button>
      <Button 
        size="sm" 
        variant={activeFilter === 'journals' ? 'default' : 'outline'}
        onClick={() => setActiveFilter('journals')}
        className="gap-1"
      >
        <BookOpen size={14} />
        Journals
      </Button>
      <Button 
        size="sm" 
        variant={activeFilter === 'news' ? 'default' : 'outline'}
        onClick={() => setActiveFilter('news')}
        className="gap-1"
      >
        <Newspaper size={14} />
        News
      </Button>
      <Button 
        size="sm" 
        variant={activeFilter === 'research' ? 'default' : 'outline'}
        onClick={() => setActiveFilter('research')}
        className="gap-1"
      >
        <Globe size={14} />
        Research
      </Button>
    </div>
  );
};

export default NewsCategoryFilter;
