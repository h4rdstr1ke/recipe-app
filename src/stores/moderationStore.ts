import { create } from 'zustand';
import { api } from '../api/api';

export interface Report {
    id: string;
    reason: string;
    customReason?: string;
    status: 'Pending' | 'Dismissed' | 'ActionTaken';
    createdAt: string;
    // ... инфа о том, на кого/что жалуются
}

interface ModerationStore {
    reports: Report[];
    isLoading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;

    fetchReports: (status?: string, reset?: boolean) => Promise<void>;
    dismissReport: (reportId: string, resolutionComment: string) => Promise<boolean>;
    takeAction: (reportId: string, resolutionComment: string) => Promise<boolean>;
}

const LIMIT = 20;

export const useModerationStore = create<ModerationStore>((set, get) => ({
    reports: [],
    isLoading: false,
    error: null,
    page: 1,
    hasMore: true,

    fetchReports: async (status = 'Pending', reset = false) => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });

        try {
            const currentPage = reset ? 1 : get().page;

            const response = await api.get('/api/moderation/reports', {
                params: {
                    status: status,
                    page: currentPage,
                    pageSize: LIMIT
                }
            });

            const items = Array.isArray(response.data) ? response.data : (response.data?.items || []);

            set(state => ({
                reports: reset ? items : [...state.reports, ...items],
                page: currentPage + 1,
                hasMore: items.length === LIMIT,
                isLoading: false
            }));
        } catch (error: any) {
            console.error("Ошибка загрузки жалоб:", error);
            set({ error: 'Не удалось загрузить список жалоб', isLoading: false });
        }
    },

    dismissReport: async (reportId, resolutionComment) => {
        try {
            await api.post(`/api/moderation/reports/${reportId}/dismiss`, { resolutionComment });
            // Убираем обработанную жалобу из списка
            set(state => ({
                reports: state.reports.filter(r => r.id !== reportId)
            }));
            return true;
        } catch (error) {
            console.error("Ошибка при отклонении жалобы:", error);
            return false;
        }
    },

    takeAction: async (reportId, resolutionComment) => {
        try {
            await api.post(`/api/moderation/reports/${reportId}/take-action`, { resolutionComment });
            // Убираем обработанную жалобу из списка
            set(state => ({
                reports: state.reports.filter(r => r.id !== reportId)
            }));
            return true;
        } catch (error) {
            console.error("Ошибка при принятии мер:", error);
            return false;
        }
    }
}));