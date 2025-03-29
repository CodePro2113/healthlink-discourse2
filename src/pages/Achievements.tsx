
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LeaderboardTable from '@/components/gamification/LeaderboardTable';
import AchievementCard from '@/components/gamification/AchievementCard';
import StreakTracker from '@/components/gamification/StreakTracker';
import ChallengesCard from '@/components/gamification/ChallengesCard';

const Achievements = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Achievements & Rewards</h1>
            <p className="text-muted-foreground">Track your progress and compete with other medical professionals</p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-primary px-3 py-1">
                <span className="font-semibold">Level 4</span>
              </Badge>
              <p className="font-medium">Established Contributor</p>
            </div>
            <div className="w-full mt-1">
              <Progress value={68} className="h-2 w-40" />
              <p className="text-xs text-muted-foreground text-right mt-1">642 / 1000 XP to Level 5</p>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Your Stats</h3>
                    <Badge variant="outline">This Month</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">642</p>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Badges Earned</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-muted-foreground">Posts Created</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold">87</p>
                      <p className="text-sm text-muted-foreground">Comments</p>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div>
                    <h4 className="font-medium mb-4">Recent Activity</h4>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary p-2 rounded-full">
                            <Badge variant="secondary" className="h-6 w-6 p-1 flex items-center justify-center">+10</Badge>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">You received an upvote on your comment</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Ranking</h3>
                  <div className="flex flex-col items-center justify-center text-center mb-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 mb-2 border-4 border-primary">
                        <AvatarImage src="https://i.pravatar.cc/150?img=8" />
                        <AvatarFallback>DM</AvatarFallback>
                      </Avatar>
                      <Badge className="absolute -bottom-2 -right-2 text-sm px-3 py-1">
                        #18
                      </Badge>
                    </div>
                    <h4 className="text-xl font-medium mt-2">Dr. Arjun Mehta</h4>
                    <p className="text-muted-foreground">Top 5% of Cardiologists</p>
                    
                    <div className="w-full mt-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Weekly Rank</span>
                        <span className="font-medium">#12</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Monthly Rank</span>
                        <span className="font-medium">#18</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>In Cardiology</span>
                        <span className="font-medium">#5</span>
                      </div>
                    </div>
                  </div>
                  
                  <StreakTracker currentStreak={3} />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Weekly Leaderboard</h3>
                  <Badge variant="outline" className="cursor-pointer">View All</Badge>
                </div>
                
                <LeaderboardTable />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Achievements</h3>
                  <Badge variant="outline" className="cursor-pointer">View All</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "First Post", description: "Created your first post", date: "2 weeks ago", icon: "Trophy" },
                    { name: "Helpful Answer", description: "Received 10 upvotes on a comment", date: "1 week ago", icon: "ThumbsUp" },
                    { name: "Regular Contributor", description: "Posted 5 days in a row", date: "3 days ago", icon: "Award" },
                    { name: "Networking Pro", description: "Connected with 10 doctors", date: "Yesterday", icon: "Users" }
                  ].map((achievement, i) => (
                    <AchievementCard key={i} achievement={achievement} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6">Your Badges</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Engagement (7/12)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {[
                        { name: "First Post", unlocked: true, icon: "FileText" },
                        { name: "Commenter", unlocked: true, icon: "MessageCircle" },
                        { name: "Upvoted", unlocked: true, icon: "ThumbsUp" },
                        { name: "Conversation Starter", unlocked: true, icon: "MessageSquare" },
                        { name: "Consistent Poster", unlocked: true, icon: "Calendar" },
                        { name: "Hot Topic", unlocked: true, icon: "TrendingUp" },
                        { name: "Popular Post", unlocked: true, icon: "Award" },
                        { name: "Discussion King", unlocked: false, icon: "Crown" },
                        { name: "Viral Content", unlocked: false, icon: "Zap" },
                        { name: "Top Commenter", unlocked: false, icon: "Star" },
                        { name: "Thought Leader", unlocked: false, icon: "Brain" },
                        { name: "Content Creator", unlocked: false, icon: "PenTool" }
                      ].map((badge, i) => (
                        <AchievementCard key={i} achievement={badge} small />
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-4">Community (3/8)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {[
                        { name: "Team Player", unlocked: true, icon: "Users" },
                        { name: "Networker", unlocked: true, icon: "Share2" },
                        { name: "Friendly", unlocked: true, icon: "Heart" },
                        { name: "Mentor", unlocked: false, icon: "BookOpen" },
                        { name: "Collaborator", unlocked: false, icon: "UserPlus" },
                        { name: "Community Leader", unlocked: false, icon: "Award" },
                        { name: "Top Contributor", unlocked: false, icon: "Trophy" },
                        { name: "Influencer", unlocked: false, icon: "Star" }
                      ].map((badge, i) => (
                        <AchievementCard key={i} achievement={badge} small />
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-4">Professional (2/6)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {[
                        { name: "Verified", unlocked: true, icon: "CheckCircle" },
                        { name: "Publisher", unlocked: true, icon: "BookOpen" },
                        { name: "Researcher", unlocked: false, icon: "FileText" },
                        { name: "Expert", unlocked: false, icon: "Award" },
                        { name: "Pioneer", unlocked: false, icon: "Compass" },
                        { name: "Innovator", unlocked: false, icon: "Lightbulb" }
                      ].map((badge, i) => (
                        <AchievementCard key={i} achievement={badge} small />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Top Contributors</h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="cursor-pointer bg-secondary/50">Weekly</Badge>
                      <Badge variant="outline" className="cursor-pointer">Monthly</Badge>
                      <Badge variant="outline" className="cursor-pointer">All Time</Badge>
                    </div>
                  </div>
                  
                  <LeaderboardTable extended />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">By Specialty</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Cardiology</h4>
                        <Badge variant="outline" className="cursor-pointer text-xs">View</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Dr. Priya Sharma</p>
                            <p className="text-xs">952 pts</p>
                          </div>
                          <Progress value={95} className="h-1.5 w-full" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Neurology</h4>
                        <Badge variant="outline" className="cursor-pointer text-xs">View</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=22" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Dr. Rahul Kapoor</p>
                            <p className="text-xs">812 pts</p>
                          </div>
                          <Progress value={81} className="h-1.5 w-full" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Pediatrics</h4>
                        <Badge variant="outline" className="cursor-pointer text-xs">View</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=28" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Dr. Ananya Gupta</p>
                            <p className="text-xs">765 pts</p>
                          </div>
                          <Progress value={76} className="h-1.5 w-full" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Oncology</h4>
                        <Badge variant="outline" className="cursor-pointer text-xs">View</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=12" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Dr. Vikram Singh</p>
                            <p className="text-xs">692 pts</p>
                          </div>
                          <Progress value={69} className="h-1.5 w-full" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Radiology</h4>
                        <Badge variant="outline" className="cursor-pointer text-xs">View</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://i.pravatar.cc/150?img=18" />
                          <AvatarFallback>DR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Dr. Neha Patel</p>
                            <p className="text-xs">631 pts</p>
                          </div>
                          <Progress value={63} className="h-1.5 w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Active Challenges</h3>
                  
                  <div className="space-y-6">
                    <ChallengesCard 
                      title="Weekly Engagement" 
                      description="Comment on 5 discussions this week" 
                      progress={3}
                      total={5}
                      reward={50}
                      daysLeft={3}
                    />
                    
                    <ChallengesCard 
                      title="Topic Master" 
                      description="Create a post in 3 different specialties" 
                      progress={1}
                      total={3}
                      reward={75}
                      daysLeft={5}
                    />
                    
                    <ChallengesCard 
                      title="Helpful Colleague" 
                      description="Get 10 upvotes on your comments" 
                      progress={7}
                      total={10}
                      reward={100}
                      daysLeft={7}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Daily Tasks</h3>
                  
                  <div className="space-y-6">
                    <ChallengesCard 
                      title="Daily Post" 
                      description="Create a post today" 
                      progress={1}
                      total={1}
                      reward={15}
                      daysLeft={0}
                      dailyTask
                      completed
                    />
                    
                    <ChallengesCard 
                      title="Active Participation" 
                      description="Comment on at least 3 discussions" 
                      progress={2}
                      total={3}
                      reward={10}
                      daysLeft={0}
                      dailyTask
                    />
                    
                    <ChallengesCard 
                      title="Community Support" 
                      description="Upvote 5 helpful comments" 
                      progress={3}
                      total={5}
                      reward={5}
                      daysLeft={0}
                      dailyTask
                    />
                    
                    <ChallengesCard 
                      title="Knowledge Sharing" 
                      description="Share a post with your network" 
                      progress={0}
                      total={1}
                      reward={5}
                      daysLeft={0}
                      dailyTask
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Completed Challenges</h3>
                
                <div className="space-y-6">
                  <ChallengesCard 
                    title="Network Builder" 
                    description="Connect with 5 new doctors" 
                    progress={5}
                    total={5}
                    reward={50}
                    completed
                  />
                  
                  <ChallengesCard 
                    title="Discussion Champion" 
                    description="Create 3 discussions that receive 5+ comments" 
                    progress={3}
                    total={3}
                    reward={100}
                    completed
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Achievements;
