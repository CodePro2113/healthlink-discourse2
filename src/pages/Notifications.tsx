
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

const Notifications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(user?.id);

  const filteredNotifications = filter === "unread"
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as "all" | "unread")}>
          <div className="border-b mb-4">
            <TabsList className="bg-transparent w-full justify-start gap-4">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            {renderNotificationsList(loading, filteredNotifications, markAsRead)}
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            {renderNotificationsList(loading, filteredNotifications, markAsRead)}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

const renderNotificationsList = (loading: boolean, notifications: any[], markAsRead: (id: string) => void) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex items-start gap-3 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No notifications to display</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg divide-y">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={markAsRead}
        />
      ))}
    </div>
  );
};

export default Notifications;
