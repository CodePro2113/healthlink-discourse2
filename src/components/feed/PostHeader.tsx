
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Clock, User, Bookmark, Flag } from 'lucide-react';
import { Author } from './PostCard';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PostHeaderProps {
  author: Author;
  createdAt: string;
  isAnonymous?: boolean;
}

export const PostHeader = ({ author, createdAt, isAnonymous }: PostHeaderProps) => {
  const [saved, setSaved] = useState(false);
  const [authorAvatar, setAuthorAvatar] = useState<string | undefined>(author?.avatar);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if the post is from the current user and ensure avatar is up-to-date
  useEffect(() => {
    const checkAuthorDetails = async () => {
      // If the author is the current user, get latest avatar
      if (user && author.id === user.id) {
        if (user.user_metadata?.avatar_url) {
          setAuthorAvatar(user.user_metadata.avatar_url);
        } else {
          try {
            // Try to get from profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('avatar')
              .eq('id', user.id)
              .single();
              
            if (profile?.avatar) {
              setAuthorAvatar(profile.avatar);
            }
          } catch (error) {
            console.error('Error fetching author profile:', error);
          }
        }
      }
    };
    
    // Check local storage for saved status
    const checkSavedStatus = () => {
      if (user) {
        try {
          const savedPosts = localStorage.getItem(`saved-posts-${user.id}`);
          if (savedPosts) {
            const savedPostsObj = JSON.parse(savedPosts);
            setSaved(!!savedPostsObj[author.id]);
          }
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      }
    };
    
    checkAuthorDetails();
    checkSavedStatus();
  }, [user, author]);

  const handleSave = () => {
    if (!user) return;
    
    const newSavedStatus = !saved;
    setSaved(newSavedStatus);
    
    // Save to local storage
    try {
      const savedPosts = localStorage.getItem(`saved-posts-${user.id}`) || '{}';
      const savedPostsObj = JSON.parse(savedPosts);
      
      if (newSavedStatus) {
        savedPostsObj[author.id] = true;
      } else {
        delete savedPostsObj[author.id];
      }
      
      localStorage.setItem(`saved-posts-${user.id}`, JSON.stringify(savedPostsObj));
      
      toast({
        title: saved ? "Post unsaved" : "Post saved",
        description: saved ? "Post removed from your saved items" : "Post added to your saved items",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error saving post status:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return past.toLocaleDateString();
  };

  return (
    <div className="flex flex-row space-y-0 items-start gap-3">
      {isAnonymous ? (
        <Avatar className="h-10 w-10 rounded-full bg-secondary">
          <AvatarFallback>
            <User className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Link to={`/profile/${author.id}`}>
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={authorAvatar} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
      )}
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div>
            {isAnonymous ? (
              <p className="font-medium">Anonymous Doctor</p>
            ) : (
              <Link to={`/profile/${author.id}`} className="font-medium hover:underline">
                {author.name}
              </Link>
            )}
            {author.specialty && !isAnonymous && (
              <p className="text-sm text-muted-foreground">{author.specialty}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock size={12} className="mr-1" />
              {formatTimeAgo(createdAt)}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSave}>
                  <Bookmark size={14} className={`mr-2 ${saved ? 'fill-primary' : ''}`} />
                  {saved ? 'Unsave post' : 'Save post'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag size={14} className="mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
