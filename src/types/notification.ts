
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  sender_id: string | null;
  entity_id: string | null;
  entity_type: EntityType | null;
  message: string;
  is_read: boolean;
  created_at: string;
  // Joined data
  sender?: {
    name: string;
    avatar: string | null;
    specialty: string;
  };
}

export type NotificationType = 
  | 'connection_request'
  | 'connection_accepted'
  | 'new_follower'
  | 'post_comment'
  | 'comment_reply'
  | 'post_like'
  | 'ai_connection_recommendation'
  | 'ai_post_recommendation'
  | 'job_posting';

export type EntityType = 'post' | 'comment' | 'connection' | 'profile' | 'job';
