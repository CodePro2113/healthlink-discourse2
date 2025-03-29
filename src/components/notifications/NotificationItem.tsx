
import { Notification } from "@/types/notification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { format, formatDistance } from "date-fns";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    onMarkAsRead(notification.id);
    
    // Navigate based on notification type and entity
    if (notification.entity_id) {
      switch (notification.type) {
        case 'post_comment':
        case 'post_like':
          navigate(`/forum/post/${notification.entity_id}`);
          break;
        case 'connection_request':
        case 'connection_accepted':
          navigate('/network');
          break;
        case 'ai_post_recommendation':
          navigate(`/forum/post/${notification.entity_id}`);
          break;
        case 'job_posting':
          navigate(`/jobs/${notification.entity_id}`);
          break;
        default:
          // For other notifications, no navigation
          break;
      }
    }
  };
  
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'connection_request':
      case 'connection_accepted':
      case 'new_follower':
        return (
          <div className="flex-shrink-0 rounded-full bg-blue-100 p-1 dark:bg-blue-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        );
      case 'post_comment':
      case 'comment_reply':
        return (
          <div className="flex-shrink-0 rounded-full bg-green-100 p-1 dark:bg-green-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        );
      case 'post_like':
        return (
          <div className="flex-shrink-0 rounded-full bg-red-100 p-1 dark:bg-red-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 rounded-full bg-primary-100 p-1 dark:bg-primary-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer hover:bg-muted transition-colors duration-200",
        !notification.is_read && "bg-muted/50 dark:bg-muted/20"
      )}
      onClick={handleClick}
    >
      {notification.sender_id ? (
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification.sender?.avatar || ''} />
          <AvatarFallback>
            {notification.sender?.name?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
      ) : (
        getNotificationIcon()
      )}
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm line-clamp-2",
          !notification.is_read && "font-medium"
        )}>
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistance(new Date(notification.created_at), new Date(), { addSuffix: true })}
        </p>
      </div>
      
      {!notification.is_read && (
        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
      )}
    </div>
  );
};
