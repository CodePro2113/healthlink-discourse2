
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Post } from '@/components/feed/PostCard';
import { useAuth } from '@/contexts/AuthContext';

export const useLikedPosts = () => {
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper function to check if a string is a valid UUID
  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const checkIfLiked = async (postId: string): Promise<boolean> => {
    if (!user) return false;
    if (!postId) return false;

    try {
      // For mock data with simple IDs, use localStorage instead of DB check
      if (!isValidUUID(postId)) {
        const storedReaction = localStorage.getItem(`post-reaction-${postId}-${user.id}`);
        return storedReaction === 'like';
      }

      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle();

      if (error) {
        console.error('Error checking like status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  };

  const toggleLike = async (post: Post): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to like posts',
        variant: 'destructive',
      });
      return false;
    }

    // Update local UI state first to make the interaction feel responsive
    const isAlreadyLiked = await checkIfLiked(post.id);
    
    try {
      setIsLiking(true);
      
      // For mock data with simple IDs, use localStorage instead of DB interaction
      if (!isValidUUID(post.id)) {
        console.log(`Using mock like behavior for non-UUID post ID: ${post.id}`);
        
        // Check if already liked from localStorage
        const storedReaction = localStorage.getItem(`post-reaction-${post.id}-${user.id}`);
        const isCurrentlyLiked = storedReaction === 'like';
        
        if (isCurrentlyLiked) {
          // Unlike the post
          localStorage.removeItem(`post-reaction-${post.id}-${user.id}`);
          return false;
        } else {
          // Like the post
          localStorage.setItem(`post-reaction-${post.id}-${user.id}`, 'like');
          // If previously disliked, remove the dislike
          if (storedReaction === 'dislike') {
            localStorage.removeItem(`post-reaction-${post.id}-${user.id}`);
          }
          return true;
        }
      }
      
      // For real DB interactions with UUID post IDs
      
      // Check if the user has a profile entry first
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
        
      // If no profile exists, create one with minimal data
      if (!profileData) {
        console.log('Creating profile for user', user.id);
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Doctor',
            specialty: 'Medical Professional'
          });
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast({
            title: 'Profile creation failed',
            description: 'Could not create your profile. Please try again later.',
            variant: 'destructive',
          });
          return isAlreadyLiked;
        }
      }
      
      // Now handle the like/unlike operation
      if (isAlreadyLiked) {
        // Unlike the post
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id);
          
        if (error) {
          console.error('Error unliking post:', error);
          toast({
            title: 'Failed to update status',
            description: 'An error occurred while updating your like status',
            variant: 'destructive',
          });
          return isAlreadyLiked; // Return original state on error
        }
        
        toast({
          title: 'Post unliked',
          description: 'This post has been removed from your liked posts',
        });
        
        return false;
      } else {
        // Like the post - use upsert to handle the case if a record already exists
        const { error } = await supabase
          .from('likes')
          .upsert({
            user_id: user.id,
            post_id: post.id,
          }, {
            onConflict: 'user_id, post_id',
            ignoreDuplicates: true
          });
          
        if (error) {
          console.error('Error liking post:', error);
          toast({
            title: 'Failed to update status',
            description: 'An error occurred while updating your like status',
            variant: 'destructive',
          });
          return isAlreadyLiked; // Return original state on error
        }
        
        toast({
          title: 'Post liked',
          description: 'This post has been added to your liked posts',
        });
        
        return true;
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      toast({
        title: 'Failed to update status',
        description: 'An error occurred while updating your like status',
        variant: 'destructive',
      });
      return isAlreadyLiked; // Return original state on error
    } finally {
      setIsLiking(false);
    }
  };

  return {
    isLiking,
    checkIfLiked,
    toggleLike,
  };
};
