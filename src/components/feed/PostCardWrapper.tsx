
import React, { useState } from 'react';
import PostCard, { Post } from './PostCard';
import { usePoints, POINTS_VALUES } from '@/contexts/PointsContext';
import { Card } from '@/components/ui/card';
import CommentSection from './comments/CommentSection';
import { Separator } from '@/components/ui/separator';

interface PostCardWrapperProps {
  post: Post;
  type?: 'feed' | 'forum';
}

const PostCardWrapper = ({ post, type = 'feed' }: PostCardWrapperProps) => {
  const { addPoints } = usePoints();
  const [expanded, setExpanded] = useState(false);
  const [commentsCount, setCommentsCount] = useState(
    Array.isArray(post.comments) ? post.comments.length : (typeof post.comments === 'number' ? post.comments : 0)
  );
  
  const handleLike = (postId: string) => {
    // Add points for upvoting
    addPoints(POINTS_VALUES.upvote, 'upvote');
  };
  
  const handleComment = (postId: string, content: string) => {
    // Add points for commenting
    addPoints(POINTS_VALUES.comment, 'comment');
    // Increment comment count
    setCommentsCount(prev => prev + 1);
  };
  
  const handleShare = (postId: string) => {
    // Add points for sharing
    addPoints(POINTS_VALUES.share, 'share');
  };
  
  const handleSave = (postId: string) => {
    // Add points for saving
    addPoints(POINTS_VALUES.save, 'save');
  };
  
  const handlePostClick = (e: React.MouseEvent) => {
    // Only toggle expansion if the click wasn't on an interactive element
    const target = e.target as HTMLElement;
    if (
      type === 'forum' && 
      !target.closest('button') && 
      !target.closest('a') &&
      !target.closest('img') &&
      !target.closest('[role="button"]') &&
      !target.closest('.image-container') // Don't expand when clicking images
    ) {
      setExpanded(!expanded);
    }
  };
  
  // Convert post.comments to an array if it's a number
  const postComments = Array.isArray(post.comments) 
    ? post.comments 
    : [];
  
  return (
    <div className="space-y-2">
      <div 
        onClick={handlePostClick}
        className={type === 'forum' ? 'cursor-pointer' : ''}
      >
        <PostCard 
          post={{
            ...post,
            comments: commentsCount // Pass the updated comment count
          }}
          type={type}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onSave={handleSave}
          expanded={expanded}
        />
      </div>
      
      {expanded && type === 'forum' && (
        <Card className="p-4 mt-1 ml-8 border-l-4 border-l-primary/30">
          <CommentSection 
            postId={post.id} 
            comments={postComments}
            onAddComment={(content) => handleComment(post.id, content)}
          />
        </Card>
      )}
    </div>
  );
};

export default PostCardWrapper;
