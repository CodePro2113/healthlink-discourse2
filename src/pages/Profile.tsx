import { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserPlus, 
  Mail, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Calendar,
  FileText,
  MessageSquare,
  Heart,
  Trophy,
  Star,
  ThumbsUp
} from "lucide-react";
import PostCard from '@/components/feed/PostCard';
import MainLayout from '@/components/layout/MainLayout';
import PointsBadge from '@/components/gamification/PointsBadge';
import StreakTracker from '@/components/gamification/StreakTracker';
import AchievementCard from '@/components/gamification/AchievementCard';
import { Progress } from '@/components/ui/progress';
import { usePoints } from '@/contexts/PointsContext';

// Mock data for profile posts
const mockProfilePosts = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Dr. Arjun Mehta',
      avatar: 'https://i.pravatar.cc/150?img=8',
      specialty: 'Cardiologist',
    },
    content: 'Excited to share that our paper on novel biomarkers for early detection of cardiovascular disease has been published in the Journal of Cardiology. Link in comments!',
    createdAt: '2023-08-15T10:30:00Z',
    likes: 87,
    comments: 23,
    shares: 15,
    tags: ['Research', 'Cardiology', 'Publication'],
  },
  {
    id: '2',
    author: {
      id: 'user1',
      name: 'Dr. Arjun Mehta',
      avatar: 'https://i.pravatar.cc/150?img=8',
      specialty: 'Cardiologist',
    },
    content: 'Attended the National Cardiology Summit yesterday. Great discussions on advances in interventional techniques. Proud to represent our hospital!',
    image: 'https://images.unsplash.com/photo-1576669801775-ff43c5ab079d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    createdAt: '2023-08-10T16:20:00Z',
    likes: 54,
    comments: 8,
    shares: 4,
    tags: ['Conference', 'Cardiology', 'Professional Development'],
  },
];

// Mock data for user achievements
const achievements = [
  { icon: Award, title: 'Top Contributor', description: 'Awarded for outstanding contributions in Cardiology' },
  { icon: FileText, title: 'Published Author', description: '10+ research papers published in prestigious journals' },
  { icon: MessageSquare, title: 'Mentor', description: 'Mentored 5+ junior doctors in specialized procedures' },
  { icon: Heart, title: 'Highly Appreciated', description: 'Received 500+ appreciations from peers' },
];

// Recent achievements for the profile
const recentAchievements = [
  { name: "First Post", description: "Created your first post", date: "2 weeks ago", icon: "Trophy" },
  { name: "Helpful Answer", description: "Received 10 upvotes on a comment", date: "1 week ago", icon: "ThumbsUp" },
  { name: "Regular Contributor", description: "Posted 5 days in a row", date: "3 days ago", icon: "Award" }
];

const Profile = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const { points } = usePoints();
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <Card className="overflow-hidden glass-card">
          <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/30"></div>
          
          <CardContent className="p-0">
            <div className="relative px-6 pb-6">
              <Avatar className="absolute -top-16 border-4 border-background w-32 h-32">
                <AvatarImage src="https://i.pravatar.cc/150?img=8" />
                <AvatarFallback>DM</AvatarFallback>
              </Avatar>
              
              <div className="ml-36 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Dr. Arjun Mehta</h1>
                    <Badge className="bg-primary text-primary-foreground">Verified</Badge>
                  </div>
                  <p className="text-muted-foreground">Cardiologist | MBBS, MD</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>Mumbai, India</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase size={14} />
                      <span>Apollo Hospitals</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap size={14} />
                      <span>15 years experience</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <PointsBadge points={points} size="lg" />
                    <Badge variant="outline">
                      <Trophy size={14} className="mr-1 text-yellow-500" />
                      Level 4
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Button 
                      variant={isFollowing ? "outline" : "default"} 
                      className="btn-hover"
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      {isFollowing ? "Following" : (
                        <>
                          <UserPlus size={16} className="mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="btn-hover">
                      <Mail size={16} className="mr-1" />
                      Message
                    </Button>
                    <Button variant="outline" size="icon" className="btn-hover">
                      <Share2 size={16} />
                    </Button>
                    <Button variant="outline" size="icon" className="btn-hover">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-muted-foreground mb-6">
                  Cardiologist with 15+ years of experience specializing in interventional cardiology and cardiac electrophysiology. Passionate about research and teaching.
                </p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Specialty</p>
                      <p className="font-medium">Cardiology</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sub-specialty</p>
                      <p className="font-medium">Interventional Cardiology</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Medical License</p>
                      <p className="font-medium">MCI-12345678</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Languages</p>
                      <p className="font-medium">English, Hindi, Marathi</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>arjun.mehta@example.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LinkIcon size={14} />
                        <a href="#" className="text-primary">www.drarjunmehta.com</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Joined August 2022</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Your Level</h3>
                  <Badge variant="outline" className="cursor-pointer">Details</Badge>
                </div>
                
                <div className="text-center mb-3">
                  <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-6">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-bold">4</span>
                      <span className="text-sm text-muted-foreground">Established</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level 5</span>
                    <span>{points} / 1000 XP</span>
                  </div>
                  <Progress value={(points / 1000) * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-secondary/30 rounded-lg p-2">
                    <p className="text-2xl font-bold">{points}</p>
                    <p className="text-xs text-muted-foreground">Total Points</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-2">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Badges Earned</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <StreakTracker currentStreak={3} />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="bg-primary/10 text-primary p-2 rounded-full h-fit">
                        <achievement.icon size={18} />
                      </div>
                      <div>
                        <h4 className="font-medium">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Network</h3>
                  <Button variant="ghost" size="sm">See all</Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Avatar key={i} className="w-12 h-12">
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${20 + i}`} />
                      <AvatarFallback>DR</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-semibold">842</span>
                    <span className="text-muted-foreground ml-1">connections</span>
                  </div>
                  <div>
                    <span className="font-semibold">1.2k</span>
                    <span className="text-muted-foreground ml-1">followers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="posts">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="publications">Publications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Posts</h3>
                  <Button variant="outline" size="sm">
                    <MessageCircle size={16} className="mr-2" />
                    New Post
                  </Button>
                </div>
                
                {mockProfilePosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>
              
              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-full h-fit">
                          <MessageCircle size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">Commented on a discussion</h4>
                            <Badge variant="secondary">+10 pts</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            "This approach has shown promising results in my practice as well. I've observed..."
                          </p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-full h-fit">
                          <ThumbsUp size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">Received 5 upvotes</h4>
                            <Badge variant="secondary">+25 pts</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            On your comment in "New Biomarkers for Early Detection of CVD"
                          </p>
                          <p className="text-xs text-muted-foreground">Yesterday</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-full h-fit">
                          <Trophy size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">Earned a new badge</h4>
                            <Badge variant="secondary">+50 pts</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            "Regular Contributor" - Posted 5 days in a row
                          </p>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-full h-fit">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">Created a new post</h4>
                            <Badge variant="secondary">+5 pts</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            "Attended the National Cardiology Summit yesterday..."
                          </p>
                          <p className="text-xs text-muted-foreground">5 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="badges" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Earned Badges</h3>
                      <Button variant="outline" size="sm">
                        <Trophy size={16} className="mr-2" />
                        View All
                      </Button>
                    </div>
                    
                    <h4 className="font-medium mb-4">Recently Earned</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {recentAchievements.map((achievement, i) => (
                        <AchievementCard key={i} achievement={achievement} />
                      ))}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h4 className="font-medium mb-4">Badges by Category</h4>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium">Engagement (7/12)</h5>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">View All</Button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {[
                            { name: "First Post", unlocked: true, icon: "FileText" },
                            { name: "Commenter", unlocked: true, icon: "MessageCircle" },
                            { name: "Upvoted", unlocked: true, icon: "ThumbsUp" },
                            { name: "Consistent", unlocked: true, icon: "Calendar" },
                            { name: "Popular", unlocked: true, icon: "Star" },
                            { name: "Viral", unlocked: false, icon: "Zap" },
                          ].map((badge, i) => (
                            <AchievementCard key={i} achievement={badge} small />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium">Community (3/8)</h5>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">View All</Button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {[
                            { name: "Team Player", unlocked: true, icon: "Users" },
                            { name: "Networker", unlocked: true, icon: "Share2" },
                            { name: "Friendly", unlocked: true, icon: "Heart" },
                            { name: "Mentor", unlocked: false, icon: "Award" },
                            { name: "Leader", unlocked: false, icon: "Trophy" },
                            { name: "Influencer", unlocked: false, icon: "Star" },
                          ].map((badge, i) => (
                            <AchievementCard key={i} achievement={badge} small />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="publications" className="mt-6">
                <Card className="p-12 flex flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-medium mb-2">Publications showcase coming soon</h3>
                  <p className="text-muted-foreground">
                    Soon you'll be able to showcase your research papers, publications and medical articles
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
