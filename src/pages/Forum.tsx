
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PostCard, { Post, Author } from '@/components/feed/PostCard';
import PostCardWrapper from '@/components/feed/PostCardWrapper';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ForumSidebar from '@/components/forum/ForumSidebar';
import ForumFilterBar from '@/components/forum/ForumFilterBar';
import NewTopicForm from '@/components/forum/NewTopicForm';
import { usePoints, POINTS_VALUES } from '@/contexts/PointsContext';
import LeaderboardModal from '@/components/gamification/LeaderboardModal';
import { AIService } from '@/utils/aiService';
import { Badge } from '@/components/ui/badge';
import { Tag, X, Filter, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const mockForumPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Dr. Vikram Singh',
      avatar: 'https://i.pravatar.cc/150?img=5',
      specialty: 'Gastroenterologist',
    },
    content: 'Looking for recommendations on the best diagnostic approach for non-alcoholic fatty liver disease in obese adolescents who show normal liver enzymes but have signs of metabolic syndrome.',
    createdAt: '2023-08-22T14:30:00Z',
    likes: 32,
    comments: 14,
    shares: 3,
    tags: ['Gastroenterology', 'Pediatrics', 'NAFLD', 'Clinical'],
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Dr. Neha Gupta',
      avatar: 'https://i.pravatar.cc/150?img=6',
      specialty: 'Rheumatologist',
    },
    content: 'Has anyone had success using biologic DMARDs in elderly patients with rheumatoid arthritis who have concurrent cardiovascular disease? Any specific monitoring protocols you follow?',
    createdAt: '2023-08-21T17:20:00Z',
    likes: 18,
    comments: 22,
    shares: 1,
    tags: ['Rheumatology', 'Geriatrics', 'Biologics', 'Clinical'],
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Dr. Suresh Menon',
      avatar: 'https://i.pravatar.cc/150?img=7',
      specialty: 'Neurologist',
    },
    content: 'Discussion: What are your experiences with the new CGRP antagonists for migraine prophylaxis? Are you seeing significant improvements compared to traditional approaches?',
    image: 'https://images.unsplash.com/photo-1559757175-7cb246e63546?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2023-08-20T10:15:00Z',
    likes: 47,
    comments: 31,
    shares: 8,
    tags: ['Neurology', 'Migraine', 'Pharmacology', 'Discussion'],
  },
  {
    id: '4',
    author: {
      id: 'anonymous',
      name: 'Anonymous',
    },
    content: 'Ethics question: How do you handle situations where family members disagree on end-of-life care decisions for a patient who lacks decision-making capacity and has no advanced directive?',
    createdAt: '2023-08-19T21:45:00Z',
    likes: 93,
    comments: 42,
    shares: 11,
    isAnonymous: true,
    tags: ['Ethics', 'Palliative Care', 'Legal', 'Discussion'],
  },
  {
    id: '5',
    author: {
      id: 'user5',
      name: 'Dr. Priya Sharma',
      avatar: 'https://i.pravatar.cc/150?img=8',
      specialty: 'Pulmonologist',
    },
    content: 'New research suggests that long-term exposure to air pollution may increase susceptibility to respiratory infections. Has anyone seen any clinical implications of this in their practice?',
    createdAt: '2023-08-18T11:30:00Z',
    likes: 63,
    comments: 37,
    shares: 14,
    tags: ['Pulmonology', 'Research', 'Environmental Health', 'Infectious Disease'],
  },
  {
    id: '6',
    author: {
      id: 'user6',
      name: 'Dr. Rahul Verma',
      avatar: 'https://i.pravatar.cc/150?img=9',
      specialty: 'Endocrinologist',
    },
    content: "Seeking opinions on the optimal management of diabetic patients who develop COVID-19. Any specific protocols you've found effective?",
    createdAt: '2023-08-17T09:15:00Z',
    likes: 41,
    comments: 29,
    shares: 7,
    tags: ['Endocrinology', 'COVID-19', 'Diabetes', 'Clinical Management'],
  }
];

const Forum = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [forumPosts, setForumPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [availableTags, setAvailableTags] = useState<{id: string, name: string, color: string}[]>([]);
  const { toast } = useToast();
  const { addPoints } = usePoints();
  
  // Use localStorage to persist forum posts between page refreshes
  useEffect(() => {
    AIService.initialize('together', 'dummy-api-key');
    fetchAvailableTags();
    
    // Try to load posts from localStorage first
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setForumPosts([...parsedPosts, ...mockForumPosts]);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing saved posts:', error);
        fetchForumPosts();
      }
    } else {
      fetchForumPosts();
    }
  }, []);
  
  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (forumPosts.length > 0 && !loading) {
      // Only save non-mock posts (posts created by the user)
      const userPosts = forumPosts.filter(post => 
        !mockForumPosts.some(mockPost => mockPost.id === post.id)
      );
      
      if (userPosts.length > 0) {
        localStorage.setItem('forumPosts', JSON.stringify(userPosts));
      }
    }
  }, [forumPosts, loading]);

  const fetchForumPosts = async () => {
    setLoading(true);
    try {
      // Check localStorage for any previously saved posts
      const savedPosts = localStorage.getItem('forumPosts');
      let userPosts: Post[] = [];
      
      if (savedPosts) {
        try {
          userPosts = JSON.parse(savedPosts);
        } catch (error) {
          console.error('Error parsing saved posts:', error);
        }
      }
      
      setForumPosts([...userPosts, ...mockForumPosts]);
    } catch (error) {
      console.error('Error in fetchForumPosts:', error);
      setForumPosts(mockForumPosts);
      toast({
        title: "Error fetching posts",
        description: "Using sample data instead",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTags = async () => {
    try {
      const response = await AIService.getPopularTags(90);
      if (response.success && response.data) {
        setAvailableTags(response.data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const filteredPosts = forumPosts.filter(post => {
    if (activeFilter === 'all') {
    } else if (activeFilter === 'trending' && post.likes <= 30) {
      return false;
    } else if (activeFilter === 'unanswered') {
      const commentCount = typeof post.comments === 'number' ? post.comments : post.comments.length;
      if (commentCount >= 1) return false;
    }
    
    if (selectedSpecialty !== 'all') {
      const matchesSpecialty = post.tags?.some(tag => 
        tag.toLowerCase() === selectedSpecialty.toLowerCase()
      );
      if (!matchesSpecialty) return false;
    }
    
    if (selectedTags.length > 0) {
      const hasAllSelectedTags = selectedTags.every(selectedTag =>
        post.tags?.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
      if (!hasAllSelectedTags) return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const contentMatch = post.content.toLowerCase().includes(searchLower);
      const titleMatch = post.title ? post.title.toLowerCase().includes(searchLower) : false;
      const tagMatch = post.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      return contentMatch || titleMatch || tagMatch;
    }
    
    return true;
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCreateTopic = async (newPost: Post) => {
    // Add the new post to the state without any page navigation
    setForumPosts(prevPosts => [newPost, ...prevPosts]);
    setIsNewTopicOpen(false);
    
    // Store the updated posts in localStorage to persist across refreshes
    const updatedPosts = [newPost, ...forumPosts.filter(post => 
      !mockForumPosts.some(mockPost => mockPost.id === post.id)
    )];
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    
    addPoints(POINTS_VALUES.post, 'post');
    
    toast({
      title: "Topic created",
      description: "Your new topic has been published to the forum.",
      variant: "success"
    });
    
    fetchAvailableTags();
  };

  const openNewTopicDialog = () => {
    setIsNewTopicOpen(true);
  };

  const openLeaderboardModal = () => {
    setIsLeaderboardOpen(true);
  };

  const handleTagClick = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleTagSearch = async () => {
    if (!searchTerm) return;
    
    setIsSearching(true);
    
    try {
      const response = await AIService.searchPostsByTagOrTerm(searchTerm);
      
      if (response.success && response.data) {
        const searchLower = searchTerm.toLowerCase();
        const searchResults = forumPosts.filter(post => 
          post.title?.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
        
        if (searchResults.length > 0) {
          toast({
            title: "Search Results",
            description: `Found ${searchResults.length} posts matching "${searchTerm}"`
          });
        } else {
          toast({
            title: "No Results",
            description: `No posts found matching "${searchTerm}"`
          });
        }
      }
    } catch (error) {
      console.error('Error searching posts:', error);
      toast({
        title: "Search Error",
        description: "There was an error searching posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setActiveFilter('all');
    setSelectedSpecialty('all');
    setSearchTerm('');
    setSelectedTags([]);
  };

  const refreshPosts = () => {
    fetchForumPosts();
    toast({
      title: "Refreshing posts",
      description: "Fetching the latest forum posts"
    });
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <ForumFilterBar 
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={setSelectedSpecialty}
              openNewTopicDialog={openNewTopicDialog}
              openLeaderboardModal={openLeaderboardModal}
              onSearch={handleSearch}
              searchTerm={searchTerm}
              isSearching={isSearching}
              onTagSearch={handleTagSearch}
            />
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshPosts}
              className="flex-shrink-0 sm:self-start"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/40 rounded-md">
              <Badge variant="outline" className="bg-background flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span className="font-medium">Filtering by:</span>
              </Badge>
              {selectedTags.map(tag => (
                <Badge 
                  key={tag} 
                  className="flex items-center gap-1 cursor-pointer"
                  variant="secondary"
                >
                  {tag}
                  <X 
                    className="h-3 w-3 hover:text-destructive" 
                    onClick={() => handleTagClick(tag)}
                  />
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 ml-auto"
                onClick={clearFilters}
              >
                <Filter className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            </div>
          )}
          
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Card className="p-8">
                  <div className="h-6 bg-muted rounded animate-pulse mb-4 w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse mb-2 w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse mb-2 w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse mb-4 w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded animate-pulse w-16" />
                    <div className="h-6 bg-muted rounded animate-pulse w-16" />
                  </div>
                </Card>
                <Card className="p-8">
                  <div className="h-6 bg-muted rounded animate-pulse mb-4 w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse mb-2 w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse mb-4 w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded animate-pulse w-16" />
                    <div className="h-6 bg-muted rounded animate-pulse w-16" />
                  </div>
                </Card>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCardWrapper key={post.id} post={post} type="forum" />
              ))
            ) : (
              <Card className="p-8 text-center">
                <CardContent>
                  <p className="text-muted-foreground mb-4">No posts match the current filters.</p>
                  <Button onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <ForumSidebar 
          openNewTopicDialog={openNewTopicDialog} 
          forumPosts={forumPosts}
          availableTags={availableTags}
          onTagClick={handleTagClick}
          selectedTags={selectedTags}
        />
      </div>

      <Dialog open={isNewTopicOpen} onOpenChange={setIsNewTopicOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
          </DialogHeader>
          <NewTopicForm 
            onCreateTopic={handleCreateTopic}
            onCancel={() => setIsNewTopicOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <LeaderboardModal 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
      />
    </MainLayout>
  );
};

export default Forum;
