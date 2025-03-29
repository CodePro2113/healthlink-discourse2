
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Post } from '@/components/feed/PostCard';
import { useAuth } from '@/contexts/AuthContext';

export const useSavedPosts = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Helper function to check if a string is a valid UUID
  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const checkIfSaved = async (postId: string): Promise<boolean> => {
    if (!user) return false;
    if (!postId) return false;

    try {
      // For mock data with simple IDs, use localStorage
      if (!isValidUUID(postId)) {
        const saved = localStorage.getItem(`saved-post-${postId}-${user.id}`);
        return saved === 'true';
      }

      const { data, error } = await supabase
        .from('saved_posts')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle();

      if (error) {
        console.error('Error checking saved status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking saved status:', error);
      return false;
    }
  };

  const toggleSave = async (post: Post): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save posts',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsSaving(true);
      
      // For mock data with simple IDs, use localStorage
      if (!isValidUUID(post.id)) {
        const isSaved = await checkIfSaved(post.id);
        
        if (isSaved) {
          localStorage.removeItem(`saved-post-${post.id}-${user.id}`);
          toast({
            title: 'Post unsaved',
            description: 'This post has been removed from your saved items',
          });
          return false;
        } else {
          localStorage.setItem(`saved-post-${post.id}-${user.id}`, 'true');
          toast({
            title: 'Post saved',
            description: 'This post has been added to your saved items',
          });
          return true;
        }
      }
      
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
          return false;
        }
      }
      
      // Check if already saved
      const isAlreadySaved = await checkIfSaved(post.id);
      
      if (isAlreadySaved) {
        // Unsave the post
        const { error } = await supabase
          .from('saved_posts')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id);
          
        if (error) {
          console.error('Error unsaving post:', error);
          throw error;
        }
        
        toast({
          title: 'Post unsaved',
          description: 'This post has been removed from your saved items',
        });
        
        return false;
      } else {
        // Save the post
        const { error } = await supabase
          .from('saved_posts')
          .insert({
            user_id: user.id,
            post_id: post.id,
          });
          
        if (error) {
          console.error('Error saving post:', error);
          throw error;
        }
        
        toast({
          title: 'Post saved',
          description: 'This post has been added to your saved items',
        });
        
        return true;
      }
    } catch (err) {
      console.error('Error toggling save:', err);
      toast({
        title: 'Error',
        description: 'Failed to update saved status. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    checkIfSaved,
    toggleSave,
  };
};
