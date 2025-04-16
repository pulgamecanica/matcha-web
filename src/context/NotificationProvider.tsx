import { useEffect, useState } from 'react';
import { useWebSocket } from '@/context/WebSocketProvider';
import { Notification } from '@/types/notification';
import { getNotifications, markAsRead, deleteNotification } from '@/api/notificationService';
import toast from 'react-hot-toast';
import { useUserMe } from '@/hooks/useUserMe';
import { NotificationContext } from '@/context/NotificationContext';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const { registerHandler } = useWebSocket();
  const { user } = useUserMe();
  

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const all = await getNotifications();
        setNotifications(all);
      } catch (e) {
        toast.error(`❌ Failed to fetch notifications: ${e}`);
      }
    };

    load();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    registerHandler('notification', (payload: Notification) => {
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === payload.id);
        if (exists) return prev;
  
        return [payload, ...prev];
      });
    });
  }, [registerHandler, user]);

  useEffect(() => {
    if (!user) return;
    setHasUnread(notifications.some((n) => n.read !== 't'));

  }, [notifications]);

  const markNotificationAsRead = async (id: number) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: "t" } : n))
    );
  };

  const removeNotification = async (id: number) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = async () => {
    await Promise.all(
      notifications
        .filter((n) => n.read !== 't')
        .map((n) => markNotificationAsRead(n.id))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markNotificationAsRead,
        removeNotification,
        markAllAsRead,
        hasUnread
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
