import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import PostCardWrapper from '@/components/feed/PostCardWrapper';
import MainLayout from '@/components/layout/MainLayout';
import { 
  PenSquare, 
  TrendingUp,
  Newspaper
} from 'lucide-react';
import { Post } from '@/components/feed/PostCard';
import NewsFeed from '@/components/feed/NewsFeed';
import { useAuth } from '@/contexts/AuthContext';
import CreatePostForm from '@/components/feed/CreatePostForm';

interface FeedProps {
  initialTab?: 'all' | 'following' | 'trending' | 'news';
}

const mockPosts = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Dr. Aisha Sharma',
      avatar: 'https://i.pravatar.cc/150?img=1',
      specialty: 'Cardiologist',
      verified: true,
    },
    content: 'Just published a new paper on the effects of hypertension management in elderly patients. Looking forward to your insights and feedback from the community.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2023-08-22T10:30:00Z',
    likes: 42,
    comments: [
      {
        id: 'comment1',
        author: {
          id: 'user2',
          name: 'Dr. Rajesh Kumar',
          avatar: 'https://i.pravatar.cc/150?img=2',
          specialty: 'Neurologist',
        },
        content: 'Fascinating research, Dr. Sharma! Have you considered the implications for patients with comorbid neurological conditions?',
        createdAt: '2023-08-22T11:35:00Z',
        likes: 7,
        replies: [
          {
            id: 'reply1',
            author: {
              id: 'user1',
              name: 'Dr. Aisha Sharma',
              avatar: 'https://i.pravatar.cc/150?img=1',
              specialty: 'Cardiologist',
            },
            content: "Great question, Dr. Kumar! We did consider neurological comorbidities in our study design, but we'll be exploring it more deeply in our follow-up research.",
            createdAt: '2023-08-22T12:05:00Z',
            likes: 4,
          }
        ]
      },
      {
        id: 'comment2',
        author: {
          id: 'user3',
          name: 'Dr. Priya Patel',
          avatar: 'https://i.pravatar.cc/150?img=3',
          specialty: 'Pediatrician',
        },
        content: 'Would love to see how these findings could be adapted for geriatric patients with prior cardiovascular events.',
        createdAt: '2023-08-22T14:30:00Z',
        likes: 5,
      }
    ],
    shares: 5,
    tags: ['Cardiology', 'Research', 'Hypertension'],
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Dr. Rajesh Kumar',
      avatar: 'https://i.pravatar.cc/150?img=2',
      specialty: 'Neurologist',
    },
    content: 'Has anyone attended the International Neurology Conference last month? Would love to connect with fellow attendees and discuss the latest developments in neurodegenerative disease treatment.',
    createdAt: '2023-08-21T14:20:00Z',
    likes: 28,
    comments: [],
    shares: 2,
    tags: ['Neurology', 'Conference', 'Networking'],
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Dr. Priya Patel',
      avatar: 'https://i.pravatar.cc/150?img=3',
      specialty: 'Pediatrician',
    },
    content: "I'm seeing an unusual increase in respiratory infections among children aged 5-10 in Mumbai. Are other pediatricians noticing similar patterns in their regions?",
    createdAt: '2023-08-20T09:15:00Z',
    likes: 76,
    comments: [
      {
        id: 'comment3',
        author: {
          id: 'anonymous',
          name: 'Anonymous Doctor',
          isAnonymous: true,
        },
        content: 'Yes, noticing the same in Delhi. We should coordinate on this issue.',
        createdAt: '2023-08-20T10:25:00Z',
        likes: 12,
      }
    ],
    shares: 15,
    tags: ['Pediatrics', 'Respiratory', 'Mumbai'],
  },
  {
    id: '4',
    author: {
      id: 'user4',
      name: 'Dr. Amit Verma',
      avatar: 'https://i.pravatar.cc/150?img=4',
      specialty: 'Oncologist',
    },
    content: 'Proud to announce that our hospital has received a new state-of-the-art radiation therapy equipment. This will significantly improve our cancer treatment capabilities.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2023-08-19T11:45:00Z',
    likes: 125,
    comments: 18,
    shares: 42,
    tags: ['Oncology', 'Technology', 'Healthcare'],
  },
  {
    id: '5',
    author: {
      id: 'anonymous',
      name: 'Anonymous',
    },
    content: "Dealing with burnout as a resident in a government hospital. The hours are brutal and patient load is overwhelming. How do you maintain work-life balance in such demanding environments?",
    createdAt: '2023-08-18T22:10:00Z',
    likes: 210,
    comments: 87,
    shares: 12,
    isAnonymous: true,
    tags: ['Mental Health', 'Work Life', 'Resident'],
  },
];

const Feed = ({ initialTab = 'all' }: FeedProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'trending' | 'news'>(initialTab);
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const loadPosts = () => {
      try {
        const storedPosts = localStorage.getItem('feed-posts');
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts);
          const sortedPosts = [...parsedPosts].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setPosts(sortedPosts);
        } else {
          const sortedMockPosts = [...mockPosts].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setPosts(sortedMockPosts);
          localStorage.setItem('feed-posts', JSON.stringify(sortedMockPosts));
        }
      } catch (error) {
        console.error("Error loading posts:", error);
        const sortedMockPosts = [...mockPosts].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setPosts(sortedMockPosts);
      }
    };
    
    loadPosts();
  }, [user?.id]);
  
  const handlePostCreated = (newPost: Post) => {
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('feed-posts', JSON.stringify(updatedPosts));
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'following' | 'trending' | 'news');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="p-4 pb-0">
              <CreatePostForm onPostCreated={handlePostCreated} />
            </CardHeader>
            <CardContent className="p-4">
            </CardContent>
          </Card>
          
          <Tabs defaultValue={activeTab} value={activeTab} className="w-full" onValueChange={handleTabChange}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-4 md:w-auto md:inline-flex">
                <TabsTrigger value="all" className="text-sm">For You</TabsTrigger>
                <TabsTrigger value="following" className="text-sm">Following</TabsTrigger>
                <TabsTrigger value="trending" className="text-sm">
                  <TrendingUp size={14} className="mr-1" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="news" className="text-sm">
                  <Newspaper size={14} className="mr-1" />
                  News
                </TabsTrigger>
              </TabsList>
              
              <Button size="sm" variant="outline" className="hidden md:flex items-center gap-1">
                <PenSquare size={14} />
                <span>Create Post</span>
              </Button>
            </div>
            
            <TabsContent value="all" className="space-y-4 mt-0">
              {posts.map((post) => (
                <PostCardWrapper key={post.id} post={post} />
              ))}
            </TabsContent>
            
            <TabsContent value="following" className="space-y-4 mt-0">
              <Card className="p-12 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-medium mb-2">Discover more doctors</h3>
                <p className="text-muted-foreground mb-4">
                  Follow more doctors to see their posts in your feed
                </p>
                <Button>Explore doctors</Button>
              </Card>
            </TabsContent>
            
            <TabsContent value="trending" className="space-y-4 mt-0">
              {posts
                .sort((a, b) => b.likes - a.likes)
                .map((post) => (
                  <PostCardWrapper key={post.id} post={post} />
                ))
              }
            </TabsContent>

            <TabsContent value="news" className="mt-0">
              <NewsFeed />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Feed;
