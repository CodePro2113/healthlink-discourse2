
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { CommentAuthor } from './types';

interface CommentHeaderProps {
  author: CommentAuthor;
  createdAt: string;
  isAnonymous?: boolean;
  formatTimeAgo: (dateString: string) => string;
}

const CommentHeader = ({ author, createdAt, isAnonymous = false, formatTimeAgo }: CommentHeaderProps) => {
  return (
    <div className="flex gap-3">
      {isAnonymous ? (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-4 w-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Avatar className="h-8 w-8">
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1 space-y-1">
        <div className="bg-muted/40 p-3 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              {isAnonymous ? (
                <p className="font-medium text-sm">Anonymous Doctor</p>
              ) : (
                <p className="font-medium text-sm">{author.name}</p>
              )}
              {author.specialty && !isAnonymous && (
                <p className="text-xs text-muted-foreground">{author.specialty}</p>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatTimeAgo(createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentHeader;
