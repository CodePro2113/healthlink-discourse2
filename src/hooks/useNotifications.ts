
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';
import { format, isToday, isYesterday } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = (userId?: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Format the notification time
  const formatNotificationTime = (dateString: string): string => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, "'Today at' h:mm a");
    } else if (isYesterday(date)) {
      return format(date, "'Yesterday at' h:mm a");
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };

  // Fetch all notifications for the user
  const fetchNotifications = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Using the type-unsafe query with explicit cast
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:sender_id(
            name,
            avatar,
            specialty
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50) as any;

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      // Type assertion since we know the shape of our data
      const typedData = data as unknown as Notification[];
      setNotifications(typedData);
      setUnreadCount(typedData.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // Using the type-unsafe query with explicit cast
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId) as any;

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Using the type-unsafe query with explicit cast
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false) as any;

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      setUnreadCount(0);
      
      toast({
        title: "Notifications cleared",
        description: "All notifications have been marked as read",
      });
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    fetchNotifications();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          // Type cast the new notification
          const newNotification = payload.new as unknown as Notification;
          
          // Add to local state
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show a toast notification
          toast({
            title: "New Notification",
            description: newNotification.message,
            variant: "default",
          });
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, toast]);

  return {
    notifications,
    unreadCount,
    loading,
    formatNotificationTime,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  };
};
