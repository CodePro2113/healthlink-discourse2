
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import CommentSection from './comments/CommentSection';
import { CommentType } from './comments/types';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostActions } from './PostActions';

  const countTotalReplies = (comments: CommentType[]): number => {
    return comments.reduce((total, comment) => {
      const nestedCount = comment.replies ? countTotalReplies(comment.replies) : 0;
      return total + 1 + nestedCount;
    }, 0);
  };


export interface Author {
  id: string;
  name: string;
  avatar?: string;
  specialty?: string;
  verified?: boolean;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: CommentType[] | number;
  shares: number;
  tags?: string[];
  isAnonymous?: boolean;
  title?: string; // Added title field to make it compatible with forum posts
}

interface PostCardProps {
  post: Post;
  type?: 'feed' | 'forum';
  expanded?: boolean;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
  onShare?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

const PostCard = ({ 
  post, 
  type = 'feed', 
  expanded = false,
  onLike, 
  onComment, 
  onShare, 
  onSave 
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  
  const handleCommentToggle = () => {
    if (type !== 'forum' || !expanded) {
      setShowComments(prev => !prev);
    }
  };

  const postComments = Array.isArray(post.comments) 
    ? post.comments 
    : [] as CommentType[];
  
  const commentsCount = Array.isArray(post.comments) 
    ? post.comments.length 
    : post.comments;
    
  // Handle adding a comment and trigger the callback
  const handleAddComment = (content: string) => {
    if (onComment) {
      onComment(post.id, content);
    }
  };

  // Handle saving a post
  const handleSave = (postId: string) => {
    if (onSave) {
      onSave(postId);
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md",
      type === 'forum' ? "border-l-4 border-l-primary" : "",
      expanded ? "border-primary/70 shadow-md" : ""
    )}>
      <CardHeader className="p-4 pb-0">
        <PostHeader 
          author={post.author}
          createdAt={post.createdAt}
          isAnonymous={post.isAnonymous}
        />
      </CardHeader>
      
      <CardContent className="p-4">
        <PostContent 
          content={post.content}
          image={post.image}
          tags={post.tags}
          expanded={expanded}
        />
      </CardContent>
      
      <Separator />
      
      <CardFooter className="p-0">
        <PostActions 
          postId={post.id}
          initialLikes={post.likes}
          initialShares={post.shares}
          commentsCount={commentsCount}
          type={type}
          onLike={onLike}
          onComment={handleCommentToggle}
          onShare={onShare}
          onSave={handleSave}
        />
      </CardFooter>
      
      {showComments && !expanded && (
        <div className="px-4 pb-4">
          <CommentSection 
            postId={post.id} 
            comments={postComments} 
            onAddComment={handleAddComment}
          />
        </div>
      )}
    </Card>
  );
};

export default PostCard;
