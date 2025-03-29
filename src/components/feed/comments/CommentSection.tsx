
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import CommentForm from './CommentForm';
import CommentActions from './CommentActions';

export interface CommentType {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    specialty?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isAnonymous?: boolean;
  replies?: CommentType[];
}

interface CommentSectionProps {
  postId: string;
  comments: CommentType[];
  onAddComment?: (content: string) => void;
}

const CommentSection = ({ postId, comments: initialComments, onAddComment }: CommentSectionProps) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load comments from localStorage on initial render
  useEffect(() => {
    const loadComments = () => {
      const savedComments = localStorage.getItem(`post-comments-${postId}`);
      if (savedComments) {
        try {
          const parsedComments = JSON.parse(savedComments);
          setComments(parsedComments);
        } catch (e) {
          console.error('Failed to parse saved comments:', e);
          setComments(initialComments || []);
        }
      } else {
        setComments(initialComments || []);
      }
    };
    
    loadComments();
  }, [postId, initialComments]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem(`post-comments-${postId}`, JSON.stringify(comments));
    }
  }, [comments, postId]);

  const handleAddComment = (content: string) => {
    if (!content.trim()) return;
    
    const comment: CommentType = {
      id: `comment-${Date.now()}`,
      author: {
        id: 'current-user',
        name: 'Dr. Current User',
        avatar: 'https://i.pravatar.cc/150?img=5',
        specialty: 'Medical Doctor',
      },
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    
    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    
    // Save to localStorage
    localStorage.setItem(`post-comments-${postId}`, JSON.stringify(updatedComments));
    
    // Call the callback if provided
    if (onAddComment) {
      onAddComment(content);
    }
    
    toast({
      title: "Comment posted",
      description: "Your comment has been successfully posted.",
    });
  };

  const handleLikeComment = (commentId: string, isLike: boolean) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        // Update directly without incrementing/decrementing again since the CommentActions component handles this
        return { ...comment };
      }
      // Check nested replies
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId ? { ...reply } : reply
          )
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    localStorage.setItem(`post-comments-${postId}`, JSON.stringify(updatedComments));
  };

  const handleReply = (commentId: string, content: string) => {
    if (!content.trim()) return;
    
    const reply: CommentType = {
      id: `reply-${Date.now()}`,
      author: {
        id: 'current-user',
        name: 'Dr. Current User',
        avatar: 'https://i.pravatar.cc/150?img=5',
        specialty: 'Medical Doctor',
      },
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    localStorage.setItem(`post-comments-${postId}`, JSON.stringify(updatedComments));
    
    setReplyToId(null);
    
    toast({
      title: "Reply posted",
      description: "Your reply has been successfully posted.",
    });
  };

  const handleCancelReply = () => {
    setReplyToId(null);
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

  const renderComment = (comment: CommentType, isReply = false) => (
    <div 
      key={comment.id}
      className={cn(
        "pt-4",
        isReply ? "pl-8 border-l-2 border-muted ml-8" : ""
      )}
    >
      <div className="flex gap-3">
        {comment.isAnonymous ? (
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
        )}
        
        <div className="flex-1 space-y-1">
          <div className="bg-muted/40 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                {comment.isAnonymous ? (
                  <p className="font-medium text-sm">Anonymous Doctor</p>
                ) : (
                  <p className="font-medium text-sm">{comment.author.name}</p>
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
          
          <CommentActions 
            commentId={comment.id}
            likes={comment.likes}
            onLike={handleLikeComment}
            onReply={!isReply ? () => setReplyToId(replyToId === comment.id ? null : comment.id) : undefined}
          />
          
          {replyToId === comment.id && (
            <div className="flex gap-2 items-start mt-2">
              <CommentForm
                buttonText="Reply"
                placeholder="Write a reply..."
                avatarSrc="https://i.pravatar.cc/150?img=5"
                onSubmit={(content) => handleReply(comment.id, content)}
                onCancel={handleCancelReply}
                autoFocus={true}
              />
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (<div className='space-y-4'>
  {comments.map(c => renderComment(c))}
      <Separator className="my-4" />
      
      <CommentForm
        onSubmit={handleAddComment}
        onCancel={() => {}} // Empty function as we always want to show the comment box
        placeholder="Write a comment..."
        avatarSrc="https://i.pravatar.cc/150?img=5"
      />
      
      <div className="mt-4">
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentSection;
