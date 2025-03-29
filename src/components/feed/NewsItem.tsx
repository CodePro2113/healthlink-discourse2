
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Book, Newspaper, Zap } from 'lucide-react';
import { NewsItem as NewsItemType } from '@/utils/newsService';
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItemProps {
  item: NewsItemType;
  handleSummarize: (id: string) => void;
  formatDate: (date: string) => string;
}

const NewsItem = ({ item, handleSummarize, formatDate }: NewsItemProps) => {
  // Clean the summary further to avoid HTML artifacts in the UI
  const cleanSummary = item.summary
    ?.replace(/&lt;/g, '<')
    ?.replace(/&gt;/g, '>')
    ?.replace(/&amp;/g, '&')
    ?.replace(/&quot;/g, '"')
    ?.replace(/&apos;/g, "'")
    ?.replace(/<font[^>]*>/g, '')
    ?.replace(/<\/font>/g, '')
    ?.replace(/<a[^>]*>(.*?)<\/a>/g, '$1')
    ?.replace(/target="_blank"/g, '')
    ?.replace(/&nbsp;/g, ' ')
    ?.trim();

  // Get badge color based on category
  const getBadgeVariant = (category: string) => {
    if (category?.toLowerCase() === 'journal') return 'journal';
    if (category?.toLowerCase() === 'news') return 'news';
    return 'secondary';
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg md:text-xl">{item.title}</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-1 mt-1">
          <span className="font-medium">{item.source}</span>
          <span className="text-xs">•</span>
          <span>{formatDate(item.published_date)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-4">
          <div className="space-y-2">
            {/* Display badges for category and specialty */}
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={getBadgeVariant(item.category)} 
                className="flex items-center gap-1 capitalize"
              >
                {item.category === 'journal' ? <Book className="h-3 w-3" /> : <Newspaper className="h-3 w-3" />}
                {item.category}
              </Badge>
              
              {item.specialty?.map(spec => (
                <Badge 
                  key={spec} 
                  variant="secondary" 
                  className="capitalize"
                >
                  {spec}
                </Badge>
              ))}
            </div>
            
            {/* Article summary */}
            <div className="text-sm text-muted-foreground">
              {cleanSummary}
            </div>

            {/* AI summary section if available */}
            {item.ai_summary && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">AI Summary</span>
                </div>
                <div className="text-sm">{item.ai_summary}</div>
              </div>
            )}
            
            {/* Summarizing indicator */}
            {item.isSummarizing && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary animate-pulse" />
                  <span className="font-medium text-sm">Generating AI Summary...</span>
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSummarize(item.id)}
            disabled={!!item.ai_summary || !!item.isSummarizing}
          >
            <Zap className="h-4 w-4 mr-1" />
            {item.ai_summary ? 'Summarized' : 'Summarize'}
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => window.open(item.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Read
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewsItem;
