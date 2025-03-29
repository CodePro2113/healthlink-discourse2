
export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
  specialty?: string;
}

export interface CommentType {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  likes: number;
  isAnonymous?: boolean;
  replies?: CommentType[]; // Support for nested replies
}

export interface CommentSectionProps {
  postId: string;
  comments: CommentType[];
  onAddComment?: (content: string) => void;
}
