import { create } from 'zustand';
import type { AppNotification } from '../types/index';
import { MOCK_NOTIFICATIONS } from '../mocks/mocks';

interface NotificationStore {
    notifications: AppNotification[];
    isLoading: boolean;
    unreadCount: number;

    fetchNotifications: () => Promise<void>;
    markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
    notifications: [],
    isLoading: false,
    // Считаем количество непрочитанных
    unreadCount: 0,

    fetchNotifications: async () => {
        set({ isLoading: true });

        // Имитация загрузки сети
        await new Promise(resolve => setTimeout(resolve, 300));

        const data = MOCK_NOTIFICATIONS;
        const unread = data.filter(n => !n.isRead).length;

        set({ notifications: data, unreadCount: unread, isLoading: false });
    },

    markAllAsRead: () => {
        const updated = get().notifications.map(n => ({ ...n, isRead: true }));
        set({ notifications: updated, unreadCount: 0 });
        // В будущем: await api.post('/notifications/read-all');
    }
}));