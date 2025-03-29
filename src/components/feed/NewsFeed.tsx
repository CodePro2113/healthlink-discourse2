
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AIService } from '@/utils/aiService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsFilter from './NewsFilter';
import NewsCategoryFilter from './NewsCategoryFilter';
import NewsItem from './NewsItem';
import NewsItemSkeleton from './NewsItemSkeleton';
import NewsEmptyState from './NewsEmptyState';
import NewsError from './NewsError';
import { AlertCircle } from 'lucide-react';
import { useNewsFeed } from '@/hooks/useNewsFeed';
import { useEffect } from 'react';

const NewsFeed = () => {
  const {
    isLoading,
    activeFilter,
    setActiveFilter,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    error,
    specialty,
    setSpecialty,
    sortOrder,
    setSortOrder,
    isRefreshing,
    specialties,
    sortedNews,
    handleRefresh,
    formatDate,
    handleSummarize,
    lastFetchTime
  } = useNewsFeed();

  // Log when the component renders with new data
  useEffect(() => {
    console.log(`NewsFeed component rendered at ${new Date().toISOString()} with ${sortedNews.length} articles`);
    console.log(`Last fetch time: ${new Date(lastFetchTime).toISOString()}`);
  }, [sortedNews.length, lastFetchTime]);

  return (
    <div className="space-y-4">
      {/* Tabs section */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="news">Medical News</TabsTrigger>
          <TabsTrigger value="journals">Journals & Research</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Search and filters section */}
      <div className="mb-6 space-y-4">
        <NewsFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          specialty={specialty}
          setSpecialty={setSpecialty}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          handleRefresh={handleRefresh}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          specialties={specialties}
        />
        
        <NewsCategoryFilter 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>

      {/* AI Service alert */}
      {!AIService.isInitialized() && (
        <Alert className="mb-4">
          <div className="flex items-center gap-2">
            <AlertDescription>
              Set your Together AI API key to enable AI-powered article summarization.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Error alert */}
      {error && <NewsError message={error} />}

      {/* Loading state */}
      {isLoading ? (
        // Loading skeletons
        Array.from({ length: 3 }).map((_, i) => (
          <NewsItemSkeleton key={i} />
        ))
      ) : sortedNews.length > 0 ? (
        // News items
        sortedNews.map(item => (
          <NewsItem 
            key={`${item.id}-${lastFetchTime}`}
            item={item} 
            handleSummarize={handleSummarize}
            formatDate={formatDate}
          />
        ))
      ) : (
        <NewsEmptyState />
      )}
    </div>
  );
};

export default NewsFeed;
