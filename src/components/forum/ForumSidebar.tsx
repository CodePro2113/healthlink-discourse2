
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare,
  ChevronRight,
  Tag,
  Tags,
  TrendingUp,
  PlusCircle
} from 'lucide-react';
import { usePoints, POINTS_VALUES } from '@/contexts/PointsContext';
import { useMemo } from 'react';
import { Post } from '@/components/feed/PostCard';

interface ForumSidebarProps {
  openNewTopicDialog: () => void;
  forumPosts: Post[];
  availableTags?: {id: string, name: string, color: string, post_count?: number}[];
  onTagClick?: (tagName: string) => void;
  selectedTags?: string[];
}

// Get a consistent color based on tag name
const getRandomColor = (name: string) => {
  const colors = [
    '#2563eb', '#db2777', '#ea580c', '#16a34a', '#7c3aed',
    '#0891b2', '#4d7c0f', '#b45309', '#be185d', '#1d4ed8'
  ];
  
  // Use the string to determine a consistent index
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const ForumSidebar = ({ 
  openNewTopicDialog, 
  forumPosts, 
  availableTags = [],
  onTagClick,
  selectedTags = []
}: ForumSidebarProps) => {
  const { addPoints } = usePoints();

  // Extract and count tags from forum posts
  const popularTopics = useMemo(() => {
    // If we have tags from the database, use those
    if (availableTags && availableTags.length > 0) {
      return availableTags
        .slice(0, 10)
        .map(tag => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
          count: tag.post_count || 0
        }));
    }
    
    // Otherwise, extract from forum posts (fallback)
    const tagCounts: Record<string, number> = {};
    
    forumPosts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Convert to array, sort by count, and take top 10
    return Object.entries(tagCounts)
      .map(([name, count]) => ({ 
        id: name.toLowerCase().replace(/\s+/g, '-'), 
        name, 
        count,
        color: getRandomColor(name)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [forumPosts, availableTags]);

  // Get trending discussions based on comments, likes, and shares
  const trendingDiscussions = useMemo(() => {
    return [...forumPosts]
      .sort((a, b) => {
        const aEngagement = (typeof a.comments === 'number' ? a.comments : a.comments.length) + a.likes + a.shares;
        const bEngagement = (typeof b.comments === 'number' ? b.comments : b.comments.length) + b.likes + b.shares;
        return bEngagement - aEngagement;
      })
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        title: post.content.length > 60 ? post.content.substring(0, 60) + '...' : post.content,
        comments: typeof post.comments === 'number' ? post.comments : post.comments.length
      }));
  }, [forumPosts]);

  const handleCreateTopic = () => {
    openNewTopicDialog();
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Popular Topics</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Tags size={16} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {popularTopics.map((topic) => (
              <Badge 
                key={topic.id} 
                variant="outline"
                style={{ 
                  borderColor: selectedTags.includes(topic.name) ? topic.color : 'transparent',
                  backgroundColor: selectedTags.includes(topic.name) 
                    ? `${topic.color}20` 
                    : 'transparent' 
                }}
                className="flex items-center gap-1 py-1 px-2 hover:bg-secondary cursor-pointer"
                onClick={() => onTagClick?.(topic.name)}
              >
                <span style={{ color: topic.color }}>•</span>
                {topic.name}
                <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full">
                  {topic.count}
                </span>
              </Badge>
            ))}
            {popularTopics.length === 0 && (
              <p className="text-sm text-muted-foreground">No topics available</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Trending Discussions</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <TrendingUp size={16} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="space-y-2">
            {trendingDiscussions.map((discussion) => (
              <div 
                key={discussion.id} 
                className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded-md cursor-pointer group"
              >
                <div className="flex-1">
                  <p className="font-medium">{discussion.title}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MessageSquare size={12} className="mr-1" />
                    {discussion.comments} comments
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
            {trendingDiscussions.length === 0 && (
              <p className="text-sm text-muted-foreground">No discussions available</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Start a New Discussion</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-muted-foreground mb-4">
            Share your medical questions, cases, or topics with the community.
          </p>
          <Button 
            className="w-full btn-hover"
            onClick={handleCreateTopic}
          >
            Create New Topic
            <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">+{POINTS_VALUES.post}</Badge>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumSidebar;
