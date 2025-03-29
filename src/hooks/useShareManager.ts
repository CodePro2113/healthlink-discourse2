import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useShareManager = () => {
  const [sharedPosts, setSharedPosts] = useState<Record<string, boolean>>({});
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load already shared posts from localStorage on initial render
  useEffect(() => {
    if (user) {
      try {
        const storedSharedPosts = localStorage.getItem(`shared-posts-${user.id}`);
        if (storedSharedPosts) {
          setSharedPosts(JSON.parse(storedSharedPosts));
        }
      } catch (error) {
        console.error("Error loading shared posts from localStorage:", error);
      }
    }
  }, [user]);

  const checkIfShared = (postId: string): boolean => {
    if (!user || !postId) return false;
    return !!sharedPosts[postId];
  };

  const sharePost = async (postId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to share posts',
        variant: 'destructive',
      });
      return false;
    }

    // If already shared, notify but allow re-sharing
    if (checkIfShared(postId)) {
      toast({
        title: 'Already shared',
        description: 'You shared this earlier. Sharing again...',
        variant: 'default',
      });
    }

    setIsSharing(true);

    try {
      // In a real app, you would call an API here (mocking it now)
      await supabase.from('shares').insert({
        user_id: user.id,
        post_id: postId
      });

      const updatedSharedPosts = { ...sharedPosts, [postId]: true };
      setSharedPosts(updatedSharedPosts);
      localStorage.setItem(`shared-posts-${user.id}`, JSON.stringify(updatedSharedPosts));

      toast({
        title: 'Post shared',
        description: 'This post has been shared to your timeline',
      });

      return true;
    } catch (error) {
      console.error("Error sharing post:", error);

      // Revert local state on error
      const updatedSharedPosts = { ...sharedPosts };
      delete updatedSharedPosts[postId];
      setSharedPosts(updatedSharedPosts);
      localStorage.setItem(`shared-posts-${user.id}`, JSON.stringify(updatedSharedPosts));

      toast({
        title: 'Failed to share',
        description: 'An error occurred while sharing this post',
        variant: 'destructive',
      });

      return false;
    } finally {
      setIsSharing(false);
    }
  };

  return {
    isSharing,
    checkIfShared,
    sharePost,
  };
};
