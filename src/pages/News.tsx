
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import NewsFeed from '@/components/feed/NewsFeed';
import { AIService } from '@/utils/aiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Zap, Database, Server, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const News = () => {
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('togetherAIKey') || '');
  const [isInitialized, setIsInitialized] = useState<boolean>(AIService.isInitialized());
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0); // Add a refresh key state
  const { toast } = useToast();

  useEffect(() => {
    // Initialize AI service if API key exists in local storage
    if (apiKey) {
      AIService.initialize('together', apiKey);
      setIsInitialized(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid Together AI API key",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('togetherAIKey', apiKey);
    AIService.initialize('together', apiKey);
    setIsInitialized(true);
    
    toast({
      title: "API Key Saved",
      description: "Your Together AI API key has been saved for this session",
      variant: "success",
    });
  };

  const handleFetchNews = async () => {
    setIsFetching(true);
    setFetchStatus("Fetching news articles. This may take a minute...");
    
    try {
      toast({
        title: "Fetching News",
        description: "Requesting fresh medical news articles from sources...",
      });
      
      // Create a timeout promise instead of using AbortController
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out after 30 seconds")), 30000);
      });
      
      // Race between the actual request and the timeout
      const result = await Promise.race([
        supabase.functions.invoke('fetch-medical-news', {
          headers: {
            'X-Supabase-Schedule': 'true'
          }
        }),
        timeoutPromise
      ]);
      
      // If we reach here, the request completed before timeout
      const { data, error } = result as any;
      
      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data || !data.success) {
        throw new Error(data?.message || "Unknown error occurred");
      }
      
      const articlesCount = data.articles_count || 0;
      
      toast({
        title: "News Fetched Successfully",
        description: `${articlesCount} medical articles have been processed.`,
        variant: "success",
      });
      
      setFetchStatus(`News fetched successfully. ${articlesCount} articles processed.`);
      
      // Update the refresh key to force NewsFeed to reload
      setRefreshKey(prevKey => prevKey + 1);
      
      // Update the fetching state after a short delay
      setTimeout(() => {
        setIsFetching(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching news:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      setFetchStatus(`Error: ${errorMessage}`);
      
      toast({
        title: "Error Fetching News",
        description: `There was a problem fetching articles: ${errorMessage}`,
        variant: "destructive",
      });
      
      setIsFetching(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">AI Medical News Feed</h1>
          <Button 
            onClick={handleFetchNews} 
            disabled={isFetching} 
            variant="default"
            size="default"
            className="gap-2"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Fetching..." : "Fetch Latest News"}
          </Button>
        </div>
        
        {fetchStatus && (
          <Alert variant={fetchStatus.includes("Error") ? "destructive" : "default"} className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {fetchStatus}
            </AlertDescription>
          </Alert>
        )}
        
        <Alert variant="default" className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This page displays the latest medical news and journal articles fetched from our backend service.
            The data is updated regularly from PubMed and other reliable medical sources.
          </AlertDescription>
        </Alert>
        
        <Alert variant="default" className="mb-6">
          <Database className="h-4 w-4" />
          <AlertDescription>
            News is fetched securely through our Supabase backend service, eliminating CORS issues and ensuring reliable access to content regardless of your location.
          </AlertDescription>
        </Alert>
        
        {!isInitialized && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Set Up AI Summarization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  To enable AI-powered article summarization, please enter your Together AI API key.
                  You can get an API key from the <a href="https://api.together.xyz/settings/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">Together AI website</a>.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="Enter your Together AI API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveApiKey}>Save Key</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: Your API key is stored in your browser's local storage and is not sent to our servers.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <NewsFeed key={refreshKey} />
      </div>
    </MainLayout>
  );
};

export default News;
