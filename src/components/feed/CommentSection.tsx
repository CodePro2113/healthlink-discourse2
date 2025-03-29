
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User, Reply, Heart, MessageCircle, Flag, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

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
  const [comments, setComments] = useState<CommentType[]>(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: CommentType = {
      id: `comment-${Date.now()}`,
      author: {
        id: 'current-user',
        name: 'Dr. Current User',
        avatar: 'https://i.pravatar.cc/150?img=5',
        specialty: 'Medical Doctor',
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
    
    // Call the callback if provided
    if (onAddComment) {
      onAddComment(newComment);
    }
    
    toast({
      title: "Comment posted",
      description: "Your comment has been successfully posted.",
    });
  };

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 };
        }
        // Check nested replies
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.id === commentId 
                ? { ...reply, likes: reply.likes + 1 } 
                : reply
            )
          };
        }
        return comment;
      })
    );
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    
    const reply: CommentType = {
      id: `reply-${Date.now()}`,
      author: {
        id: 'current-user',
        name: 'Dr. Current User',
        avatar: 'https://i.pravatar.cc/150?img=5',
        specialty: 'Medical Doctor',
      },
      content: replyContent,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setComments(
      comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        }
        return comment;
      })
    );
    
    setReplyToId(null);
    setReplyContent('');
    
    toast({
      title: "Reply posted",
      description: "Your reply has been successfully posted.",
    });
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
          
          <div className="flex items-center gap-4 text-xs">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-muted-foreground hover:text-primary"
              onClick={() => handleLikeComment(comment.id)}
            >
              <Heart size={14} className="mr-1" />
              {comment.likes > 0 && <span>{comment.likes}</span>}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-muted-foreground hover:text-primary"
              onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
            >
              <Reply size={14} className="mr-1" />
              <span>Reply</span>
            </Button>
            
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
          
          {replyToId === comment.id && (
            <div className="flex gap-2 items-start mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://i.pravatar.cc/150?img=5" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[80px] text-sm mb-2"
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setReplyToId(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleReply(comment.id)}
                  >
                    Reply
                  </Button>
                </div>
              </div>
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

  return (
    <div className="mt-4">
      <Separator className="my-4" />
      
      <div className="flex gap-3 items-start">
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://i.pravatar.cc/150?img=5" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end mt-2">
            <Button onClick={handleAddComment}>
              <MessageCircle size={16} className="mr-2" />
              Comment
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        {comments.map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentSection;
