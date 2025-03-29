
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ThumbsUp, ThumbsDown, Reply, Flag, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommentActionsProps {
  commentId: string;
  likes: number;
  onLike: (commentId: string, isLike: boolean) => void;
  onReply?: (commentId: string) => void; // Make optional for max depth replies
}

const CommentActions = ({ commentId, likes, onLike, onReply }: CommentActionsProps) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const { user } = useAuth();
  const { toast } = useToast();

  // Store user reaction in localStorage to persist between page refreshes
  useEffect(() => {
    if (user) {
      const storedReaction = localStorage.getItem(`comment-reaction-${commentId}-${user.id}`);
      if (storedReaction === 'like') {
        setLiked(true);
      } else if (storedReaction === 'dislike') {
        setDisliked(true);
      }
    }
  }, [commentId, user]);

  // Handle like action
  const handleLike = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to like comments',
        variant: 'destructive',
      });
      return;
    }

    // Update UI state first
    let newLikesCount = likesCount;

    // If the comment is already liked by the user, remove the like
    if (liked) {
      setLiked(false);
      newLikesCount -= 1;
      localStorage.removeItem(`comment-reaction-${commentId}-${user.id}`);
    } 
    // If the comment is disliked, switch from dislike to like
    else if (disliked) {
      setDisliked(false);
      setLiked(true);
      newLikesCount += 2; // +2 because we're removing a dislike (-1) and adding a like (+1)
      localStorage.setItem(`comment-reaction-${commentId}-${user.id}`, 'like');
    } 
    // If neither liked nor disliked, add like
    else {
      setLiked(true);
      newLikesCount += 1;
      localStorage.setItem(`comment-reaction-${commentId}-${user.id}`, 'like');
    }
    
    setLikesCount(newLikesCount);
    
    try {
      onLike(commentId, true);
    } catch (error) {
      console.error("Error in handleLike:", error);
      // Reset UI state on error
      setLiked(liked);
      setDisliked(disliked);
      setLikesCount(likes);
      toast({
        title: 'Failed to update status',
        description: 'An error occurred while updating your like status',
        variant: 'destructive',
      });
    }
  };

  // Handle dislike action
  const handleDislike = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to dislike comments',
        variant: 'destructive',
      });
      return;
    }

    // Update UI state first
    let newLikesCount = likesCount;

    // Prevent multiple dislikes - if already disliked, remove dislike
    if (disliked) {
      setDisliked(false);
      newLikesCount += 1;
      localStorage.removeItem(`comment-reaction-${commentId}-${user.id}`);
    } 
    // If liked, switch from like to dislike
    else if (liked) {
      setLiked(false);
      setDisliked(true);
      newLikesCount -= 2; // -2 because we're removing a like (+1) and adding a dislike (-1)
      localStorage.setItem(`comment-reaction-${commentId}-${user.id}`, 'dislike');
    } 
    // If neither liked nor disliked, add dislike
    else {
      setDisliked(true);
      newLikesCount -= 1;
      localStorage.setItem(`comment-reaction-${commentId}-${user.id}`, 'dislike');
    }
    
    setLikesCount(newLikesCount);
    
    try {
      onLike(commentId, false);
    } catch (error) {
      console.error("Error in handleDislike:", error);
      // Reset UI state on error
      setLiked(liked);
      setDisliked(disliked);
      setLikesCount(likes);
      toast({
        title: 'Failed to update status',
        description: 'An error occurred while updating your like status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex items-center gap-4 text-xs">
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 px-2 ${liked ? 'text-emerald-500' : 'text-muted-foreground hover:text-primary'}`}
        onClick={handleLike}
      >
        <ThumbsUp size={14} className={`mr-1 ${liked ? 'fill-emerald-500' : ''}`} />
        {likesCount > 0 && <span>{likesCount}</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={`h-8 px-2 ${disliked ? 'text-rose-500' : 'text-muted-foreground hover:text-primary'}`}
        onClick={handleDislike}
      >
        <ThumbsDown size={14} className={`mr-1 ${disliked ? 'fill-rose-500' : ''}`} />
      </Button>

      {onReply && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-primary"
          onClick={() => onReply(commentId)}
        >
          <Reply size={14} className="mr-1" />
          <span>Reply</span>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <MoreHorizontal size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Flag size={14} className="mr-2" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CommentActions;
