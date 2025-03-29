
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  placeholder?: string;
  avatarSrc?: string;
  buttonText?: string;
  initialValue?: string;
  autoFocus?: boolean;
}

const CommentForm = ({
  onSubmit,
  onCancel,
  placeholder = 'Add a comment...',
  avatarSrc,
  buttonText = 'Comment',
  initialValue = '',
  autoFocus = false
}: CommentFormProps) => {
  const [content, setContent] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [userInitial, setUserInitial] = useState<string>('U');

  useEffect(() => {
    // Focus on textarea if autoFocus is true
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
    
    // Get user avatar and initial
    const fetchUserDetails = async () => {
      // First check user metadata from auth context
      if (user?.user_metadata?.avatar_url) {
        setUserAvatar(user.user_metadata.avatar_url);
      } else if (user) {
        // Try to get from profile if available
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('avatar, name')
            .eq('id', user.id)
            .single();
            
          if (profile?.avatar) {
            setUserAvatar(profile.avatar);
          }
          
          if (profile?.name) {
            setUserInitial(profile.name[0]);
          } else {
            setUserInitial(user.email?.[0]?.toUpperCase() || 'U');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    fetchUserDetails();
  }, [autoFocus, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setContent('');
    onCancel();
  };

  // Use explicitly fetched avatar first, then fallback to prop
  const displayAvatar = userAvatar || avatarSrc;

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-3">
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarImage src={displayAvatar} alt="User" />
        <AvatarFallback>{userInitial}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] w-full"
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            disabled={!content.trim()}
          >
            <SendHorizontal className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
