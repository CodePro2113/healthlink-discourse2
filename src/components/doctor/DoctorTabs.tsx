
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DoctorProfile as DoctorProfileType } from "@/types/doctor";
import PostCard from '@/components/feed/PostCard';
import { FileText, MessageSquare, GraduationCap } from "lucide-react";

interface DoctorTabsProps {
  doctor: DoctorProfileType;
}

const DoctorTabs = ({ doctor }: DoctorTabsProps) => {
  // Mock data for profile posts
  const mockProfilePosts = [
    {
      id: '1',
      author: {
        id: doctor.id,
        name: doctor.name,
        avatar: doctor.avatar,
        specialty: doctor.specialty,
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
        id: doctor.id,
        name: doctor.name,
        avatar: doctor.avatar,
        specialty: doctor.specialty,
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

  return (
    <Tabs defaultValue="posts">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts" className="space-y-6 mt-6">
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
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="font-medium">Published a research paper</h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    "Novel biomarkers for early detection of cardiovascular disease"
                  </p>
                  <p className="text-xs text-muted-foreground">3 weeks ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary p-2 rounded-full h-fit">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h4 className="font-medium">Commented on a discussion</h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    "This approach has shown promising results in my practice as well. I've observed..."
                  </p>
                  <p className="text-xs text-muted-foreground">1 month ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="education" className="mt-6">
        {doctor.education && doctor.education.length > 0 ? (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Education & Training</h3>
              <div className="space-y-6">
                {doctor.education.map((edu: any) => (
                  <div key={edu.id} className="flex gap-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-full h-fit">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">{edu.institution}</h4>
                      <p className="text-sm">{edu.degree}, {edu.field}</p>
                      <p className="text-xs text-muted-foreground">
                        {edu.startYear} - {edu.isOngoing ? 'Present' : edu.endYear}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No education information available</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DoctorTabs;
