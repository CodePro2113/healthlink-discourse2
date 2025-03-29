
import { useState } from 'react';
import { cn } from '@/lib/utils';
import CommentActions from './CommentActions';
import CommentForm from './CommentForm';
import { CommentType } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePoints, POINTS_VALUES } from '@/contexts/PointsContext';

interface SingleCommentProps {
  comment: CommentType;
  isReply?: boolean;
  level?: number;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
  formatTimeAgo: (dateString: string) => string;
}

const MAX_NESTING_LEVEL = 3; // Limit nesting to 3 levels deep (comment → reply → sub-reply)

const SingleComment = ({ 
  comment, 
  isReply = false,
  level = 0,
  onLike, 
  onReply, 
  formatTimeAgo 
}: SingleCommentProps) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(comment.likes);
  const { addPoints } = usePoints();

  const handleReplyClick = (commentId: string) => {
    setReplyOpen(!replyOpen);
  };

  const handleLikeAction = (commentId: string, isLike: boolean) => {
    // Call the parent onLike function
    onLike(commentId);
    
    // Add points for liking content
    if (isLike) {
      addPoints(POINTS_VALUES.upvote, 'upvote');
    }
  };

  const handleSubmitReply = (content: string) => {
    if (content.trim()) {
      onReply(comment.id, content);
      
      // Add points for commenting/replying
      addPoints(POINTS_VALUES.comment, 'comment');
      
      // Simulate points for getting a reply (would normally be given to the parent comment author)
      if (level > 0) {
        // This is a reply to a comment or another reply
        // In a real app, we would give points to the parent comment author
        console.log('Parent comment author would get points for receiving a reply');
      }
    }
    setReplyOpen(false);
  };

  const handleCancelReply = () => {
    setReplyOpen(false);
  };

  // Calculate left border color based on nesting level for visual distinction
  const getBorderColor = () => {
    switch (level % 3) {
      case 0: return 'border-primary/30';
      case 1: return 'border-blue-300/50';
      case 2: return 'border-green-300/50';
      default: return 'border-muted';
    }
  };

  // Calculate indentation based on nesting level
  const getIndentation = () => {
    if (level === 0) return '';
    return `ml-${Math.min(level * 4, 12)}`; // Max indentation of ml-12
  };

  return (
    <div
      key={comment.id}
      className={cn(
        "pt-4",
        level > 0 && `border-l-2 ${getBorderColor()} ${getIndentation()}`
      )}
    >
      <div className="flex gap-3">
        <CommentAvatar comment={comment} />
        
        <div className="flex-1 space-y-1">
          <CommentContent comment={comment} formatTimeAgo={formatTimeAgo} level={level} />
          
          <CommentActions 
            commentId={comment.id}
            likes={currentLikes}
            onLike={handleLikeAction}
            onReply={level >= MAX_NESTING_LEVEL ? undefined : handleReplyClick}
          />
          
          {replyOpen && level < MAX_NESTING_LEVEL && (
            <CommentForm
              onSubmit={handleSubmitReply}
              onCancel={handleCancelReply}
              buttonText="Reply"
              placeholder="Write a reply..."
              autoFocus={true}
            />
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map(reply => (
                <SingleComment
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                  level={level + 1}
                  onLike={onLike}
                  onReply={onReply}
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentAvatar = ({ comment }: { comment: CommentType }) => {
  return comment.isAnonymous ? (
    <Avatar className="h-8 w-8">
      <AvatarFallback>
        <User className="h-4 w-4 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  ) : (
    <Avatar className="h-8 w-8">
      <AvatarImage src={comment.author.avatar} />
      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

const CommentContent = ({ 
  comment, 
  formatTimeAgo,
  level = 0
}: { 
  comment: CommentType, 
  formatTimeAgo: (dateString: string) => string,
  level?: number
}) => {
  // Different background colors based on nesting level
  const getBgColor = () => {
    switch (level % 3) {
      case 0: return 'bg-muted/40';
      case 1: return 'bg-blue-50/30 dark:bg-blue-950/20';
      case 2: return 'bg-green-50/30 dark:bg-green-950/20';
      default: return 'bg-muted/40';
    }
  };
  
  return (
    <div className={`${getBgColor()} p-3 rounded-lg`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {comment.isAnonymous ? (
            <p className="font-medium text-sm">Anonymous Doctor</p>
          ) : (
            <p className="font-medium text-sm">{comment.author.name}</p>
          )}
          {level > 0 && (
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              {level === 1 ? 'Reply' : `Level ${level} reply`}
            </Badge>
          )}
          {comment.author.specialty && !comment.isAnonymous && (
            <p className="text-xs text-muted-foreground">{comment.author.specialty}</p>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatTimeAgo(comment.createdAt)}
        </div>
      </div>
      <p className="mt-1 text-sm">{comment.content}</p>
    </div>
  );
};

export default SingleComment;

