
import { useState, useEffect } from 'react';
import { NewsService, NewsItem } from '@/utils/newsService';
import { useToast } from '@/hooks/use-toast';
import { AIService } from '@/utils/aiService';

export function useNewsFeed() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'journals' | 'news' | 'research'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'journals' | 'news'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState<string | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  const { toast } = useToast();

  // List of medical specialties for filter
  const specialties = ['all', 'Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Infectious Disease', 
                     'Psychiatry', 'Radiology', 'Endocrinology', 'Geriatrics', 'Public Health'];

  // Function to fetch news data
  const fetchNews = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Map our specialty value to the correct format for the API
      const specialtyParam = specialty === 'all' ? 'general' : specialty.toLowerCase();
      
      // Fetch news data from backend
      const items = await NewsService.fetchMedicalNews(specialtyParam, forceRefresh);
      
      if (items.length === 0) {
        setError('No articles found. Try selecting a different specialty or try again later.');
      } else {
        // Check if items contain mock data by looking for "mock" in the ID
        const containsMockData = items.some(item => item.id.includes('mock'));
        if (containsMockData) {
          toast({
            title: "Using Simulated Data",
            description: "Live data couldn't be fetched. Displaying simulated medical news instead.",
            variant: "destructive",
          });
        }
        const realItems = items.filter(item => !item.id.includes('mock'));
      if (realItems.length === 0) {
        setError('No real medical news found. Check your API key or try again later.');
        setNewsItems([]);
      } else {
        setNewsItems(realItems);
        setLastFetchTime(Date.now());
      }
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load the latest medical news. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch news when component mounts or specialty changes
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialty]);

  // Handle refresh button click
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchNews(true);
  };

  // Filter news items based on multiple criteria
  const filteredNews = newsItems.filter(item => {
    // Filter by tab (content type)
    if (activeTab === 'journals' && item.category !== 'journal') return false;
    if (activeTab === 'news' && item.category === 'journal') return false;
    
    // Filter by category if using the buttons
    if (activeFilter !== 'all') {
      if (activeFilter === 'journals' && item.category !== 'journal') return false;
      if (activeFilter === 'news' && item.category !== 'news') return false;
      if (activeFilter === 'research' && item.category !== 'research') return false;
    }
    
    // Filter by specialty
    if (specialty !== 'all' && (!item.specialty || !item.specialty.includes(specialty))) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) || 
        item.summary.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query) ||
        (item.specialty && item.specialty.some(s => s.toLowerCase().includes(query)))
      );
    }
    
    return true;
  });

  // Sort the filtered news based on date
  const sortedNews = [...filteredNews].sort((a, b) => {
    const dateA = new Date(a.published_date).getTime();
    const dateB = new Date(b.published_date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSummarize = async (itemId: string) => {
    // Find the news item to summarize
    const itemIndex = newsItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    const item = newsItems[itemIndex];
    
    // If already summarized, do nothing
    if (item.ai_summary) return;
    
    // Check if API key is set
    if (!AIService.isInitialized()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Together AI API key first",
        variant: "destructive",
      });
      return;
    }
    
    // Set item to summarizing state
    const updatedItems = [...newsItems];
    updatedItems[itemIndex] = { ...item, isSummarizing: true };
    setNewsItems(updatedItems);
    
    try {
      // Generate AI summary
      const aiSummary = await NewsService.generateSummary(item);
      
      if (aiSummary) {
        // Update the news item with the AI summary
        const finalUpdatedItems = [...newsItems];
        finalUpdatedItems[itemIndex] = { 
          ...item, 
          ai_summary: aiSummary, 
          isSummarizing: false 
        };
        setNewsItems(finalUpdatedItems);
        
        toast({
          title: "Summary Generated",
          description: "AI summary has been generated successfully.",
          variant: "success",
        });
      } else {
        throw new Error('Failed to generate summary');
      }
    } catch (err) {
      toast({
        title: "Failed to Generate Summary",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      // Reset summarizing state
      const updatedItems = [...newsItems];
      updatedItems[itemIndex] = { ...item, isSummarizing: false };
      setNewsItems(updatedItems);
    }
  };

  return {
    newsItems,
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
  };
}
