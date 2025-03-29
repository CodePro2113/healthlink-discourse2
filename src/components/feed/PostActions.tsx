
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useLikedPosts } from '@/hooks/useLikedPosts';
import { useSavedPosts } from '@/hooks/useSavedPosts';
import { useShareManager } from '@/hooks/useShareManager';
import { Heart, MessageCircle, Share2, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PostActionsProps {
  postId: string;
  initialLikes: number;
  initialShares: number;
  commentsCount: number;
  type?: 'feed' | 'forum';
  onLike?: (postId: string) => void;
  onComment?: () => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

export const PostActions = ({ 
  postId, 
  initialLikes, 
  initialShares, 
  commentsCount, 
  type = 'feed',
  onLike,
  onComment,
  onShare,
  onSave
}: PostActionsProps) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [sharesCount, setSharesCount] = useState(initialShares);
  const [dislikesCount, setDislikesCount] = useState(0);
  const { toast } = useToast();
  const { checkIfLiked, toggleLike } = useLikedPosts();
  const { checkIfSaved, toggleSave } = useSavedPosts();
  const { checkIfShared, sharePost } = useShareManager();
  const { user } = useAuth();
  
  useEffect(() => {
    const checkPostStatus = async () => {
      try {
        if (user) {
          // Check if user has already interacted with this post
          const storedReaction = localStorage.getItem(`post-reaction-${postId}-${user.id}`);
          
          if (storedReaction) {
            setLiked(storedReaction === 'like');
            setDisliked(storedReaction === 'dislike');
          } else {
            const isLiked = await checkIfLiked(postId);
            setLiked(isLiked);
          }
          
          const isSaved = await checkIfSaved(postId);
          setSaved(isSaved);
          
          const storedDislikes = localStorage.getItem(`post-dislikes-${postId}`);
          if (storedDislikes) {
            setDislikesCount(parseInt(storedDislikes, 10));
          }
        } else {
          setLiked(false);
          setDisliked(false);
          setSaved(false);
        }
      } catch (error) {
        console.error("Error checking post status:", error);
      }
    };
    
    checkPostStatus();
  }, [postId, user, checkIfLiked, checkIfSaved]);
  
  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to like posts',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Update UI state first
      const wasLiked = liked;
      const wasDisliked = disliked;
      
      // If was disliked, remove dislike first
      if (disliked) {
        setDisliked(false);
        const newDislikeCount = Math.max(0, dislikesCount - 1);
        setDislikesCount(newDislikeCount);
        localStorage.setItem(`post-dislikes-${postId}`, newDislikeCount.toString());
      }
      
      // Toggle like state
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
      
      if (liked) {
        localStorage.removeItem(`post-reaction-${postId}-${user.id}`);
      } else {
        localStorage.setItem(`post-reaction-${postId}-${user.id}`, 'like');
      }
      
      const post = {
        id: postId,
        author: { id: '', name: '' },
        content: '',
        createdAt: '',
        likes: likesCount,
        comments: commentsCount,
        shares: sharesCount
      };
      
      // Call API
      const success = await toggleLike(post);
      
      if (!success) {
        // Revert UI if API call failed
        setLiked(wasLiked);
        setDisliked(wasDisliked);
        setLikesCount(prev => liked ? prev + 1 : prev - 1);
        
        if (wasLiked) {
          localStorage.setItem(`post-reaction-${postId}-${user.id}`, 'like');
        } else if (wasDisliked) {
          localStorage.setItem(`post-reaction-${postId}-${user.id}`, 'dislike');
          setDislikesCount(prev => prev + 1);
          localStorage.setItem(`post-dislikes-${postId}`, (dislikesCount + 1).toString());
        } else {
          localStorage.removeItem(`post-reaction-${postId}-${user.id}`);
        }
      } else if (onLike) {
        onLike(postId);
      }
    } catch (error) {
      console.error("Error in handleLike:", error);
      toast({
        title: 'Failed to update status',
        description: 'An error occurred while updating your like status',
        variant: 'destructive',
      });
    }
  };
  
  const handleDislike = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to dislike posts',
        variant: 'destructive',
      });
      return;
    }
    
    // Update UI state first
    const wasLiked = liked;
    const wasDisliked = disliked;
    
    // If was liked, remove like first
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    }
    
    // Toggle dislike state
    setDisliked(!disliked);
    const newDislikeCount = disliked ? Math.max(0, dislikesCount - 1) : dislikesCount + 1;
    setDislikesCount(newDislikeCount);
    
    if (disliked) {
      localStorage.removeItem(`post-reaction-${postId}-${user.id}`);
    } else {
      localStorage.setItem(`post-reaction-${postId}-${user.id}`, 'dislike');
      
      if (!wasDisliked) {
        toast({
          title: "Post disliked",
          description: "Your feedback has been recorded",
          duration: 2000,
        });
      }
    }
    
    localStorage.setItem(`post-dislikes-${postId}`, newDislikeCount.toString());
  };
  
  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to save posts',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Update UI state first
      const wasSaved = saved;
      setSaved(!saved);
      
      const post = {
        id: postId,
        author: { id: '', name: '' },
        content: '',
        createdAt: '',
        likes: likesCount,
        comments: commentsCount,
        shares: sharesCount
      };
      
      // Call API
      const isSaved = await toggleSave(post);
      
      // If API call failed, revert UI
      if (isSaved !== !wasSaved) {
        setSaved(wasSaved);
        toast({
          title: 'Failed to update status',
          description: 'An error occurred while updating your save status',
          variant: 'destructive',
        });
      } else if (onSave) {
        onSave(postId);
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      setSaved(saved); // Revert on error
      toast({
        title: 'Failed to update status',
        description: 'An error occurred while updating your save status',
        variant: 'destructive',
      });
    }
  };
  
  const handleShare = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to share posts',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Check if already shared
      const isAlreadyShared = checkIfShared(postId);
      if (isAlreadyShared) {
        toast({
          title: "Already shared",
          description: "You have already shared this post",
          duration: 2000,
        });
        return;
      }
      
      // Update UI first for responsiveness
      setSharesCount(prev => prev + 1);
      
      // Call API
      const success = await sharePost(postId);
      
      if (!success) {
        // Revert UI if API call failed
        setSharesCount(prev => prev - 1);
      } else if (onShare) {
        onShare(postId);
      }
    } catch (error) {
      console.error("Error in handleShare:", error);
      setSharesCount(prev => prev - 1); // Revert on error
      toast({
        title: 'Failed to share',
        description: 'An error occurred while sharing this post',
        variant: 'destructive',
      });
    }
  };

  if (type === 'feed') {
    return (
      <div className="p-2 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike}
          className={cn(
            "flex-1 gap-1",
            liked && "text-primary"
          )}
        >
          <Heart size={18} className={liked ? "fill-primary" : ""} />
          <span>{likesCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 gap-1"
          onClick={onComment}
        >
          <MessageCircle size={18} />
          <span>{commentsCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex-1 gap-1"
          onClick={handleShare}
          disabled={checkIfShared(postId)}
        >
          <Share2 size={18} />
          <span>{sharesCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSave}
          className={cn(
            "flex-1 gap-1",
            saved && "text-primary"
          )}
        >
          <Bookmark size={18} className={saved ? "fill-primary" : ""} />
          <span>Save</span>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-2 flex justify-between">
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "gap-1",
            liked ? "text-emerald-500" : ""
          )}
          onClick={handleLike}
        >
          <ThumbsUp size={18} className={liked ? "fill-emerald-500" : ""} />
          <span>{likesCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "gap-1",
            disliked ? "text-rose-500" : ""
          )}
          onClick={handleDislike}
        >
          <ThumbsDown size={18} className={disliked ? "fill-rose-500" : ""} />
          <span>{dislikesCount > 0 ? dislikesCount : ''}</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={onComment}
        >
          <MessageCircle size={18} />
          <span>{commentsCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={handleShare}
          disabled={checkIfShared(postId)}
        >
          <Share2 size={18} />
          <span>{sharesCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSave}
          className={cn(
            saved && "text-primary"
          )}
        >
          <Bookmark size={18} className={saved ? "fill-primary" : ""} />
        </Button>
      </div>
    </div>
  );
};
