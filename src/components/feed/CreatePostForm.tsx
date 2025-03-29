
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Image, 
  FileText, 
  LinkIcon, 
  MessageCircle,
  CalendarPlus,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePoints, POINTS_VALUES } from '@/contexts/PointsContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Post } from './PostCard';

interface CreatePostFormProps {
  onPostCreated: (post: Post) => void;
}

const CreatePostForm = ({ onPostCreated }: CreatePostFormProps) => {
  const [postContent, setPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();
  const { addPoints } = usePoints();
  const { user } = useAuth();

  
const handleCreatePost = async () => {
  if (!postContent.trim()) {
    toast({
      title: "Empty post",
      description: "Please write something before posting.",
      variant: "destructive",
    });
    return;
  }

  try {
    let authorData: any = {
      id: "anonymous",
      name: "Anonymous",
    };

    if (!isAnonymous && user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        authorData = {
          id: profile.id,
          name: profile.name || "Dr. User",
          avatar: profile.avatar,
          specialty: profile.specialty || "Medical Professional",
        };
      }
    }

    const { data: post, error } = await supabase.from("posts").insert({
      content: postContent,
      author_id: authorData.id,
      author_name: authorData.name,
      author_avatar: authorData.avatar || null,
      created_at: new Date().toISOString(),
      tags: [],
    }).select().single();

    if (error) {
      throw error;
    }

    setPostContent("");
    toast({ title: "Posted!", description: "Your post was created successfully." });
    addPoints(POINTS_VALUES.post);
    onPostCreated(post);
  } catch (err: any) {
    console.error("Error creating post:", err);
    toast({
      title: "Post failed",
      description: "There was an error creating your post. Please try again.",
      variant: "destructive",
    });
  }
};
;

export default CreatePostForm;
