import { create } from 'zustand';

export interface Post {
    id: string;
    authorId: string;
    authorNickname: string;
    authorAvatar: string;
    image: string;
    title: string;
    description: string;
    date: string;
    rating: number;
    timeAgo: string;
    isLiked: boolean;
    isFavorited: boolean;
    likesCount: number;
    favoritesCount: number;
    commentsCount: number;
    ingredients: string[];
}



interface PostStore {
    posts: Post[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;

    // Действия
    fetchPosts: (reset?: boolean) => Promise<void>;
    likePost: (postId: string) => Promise<void>;
    unlikePost: (postId: string) => Promise<void>;
    favoritePost: (postId: string) => Promise<void>;
    unfavoritePost: (postId: string) => Promise<void>;
    subscribeToAuthor: (authorId: string) => Promise<void>;
    clearError: () => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
    posts: [],
    isLoading: false,
    error: null,
    hasMore: true,
    page: 1,

    // Загрузка постов (с пагинацией для бесконечной ленты)
    fetchPosts: async (reset = false) => {
        set({ isLoading: true, error: null });

        //const currentPage = reset ? 1 : get().page;

        try {
            // Заменить uf API запрос
            // const response = await api.get(`/posts?page=${currentPage}&limit=10`);

            // Временные тестовые данные
            const mockPosts: Post[] = [
                {
                    id: '1',
                    authorId: 'user1',
                    authorNickname: 'vlad228',
                    authorAvatar: '/src/assets/avatar.svg',
                    image: '/src/assets/testPost2.png',
                    title: 'Картошка по деревенски',
                    description: 'Вкусная картошка с домашним майонезом и кетчупом, специями',
                    date: '27.01.2025',
                    rating: 1,
                    timeAgo: '50 минут',
                    isLiked: false,
                    isFavorited: false,
                    likesCount: 0,
                    favoritesCount: 0,
                    commentsCount: 0,
                    ingredients: ['чеснок ', 'молоко', 'острое']
                },
                {
                    id: '2',
                    authorId: 'user1',
                    authorNickname: 'Onerin@',
                    authorAvatar: '/src/assets/avatar.svg',
                    image: '/src/assets/testPost2.png',
                    title: 'Картошка по деревенски',
                    description: 'Вкусная картошка с домашним майонезом и кетчупом, специями',
                    date: '26.01.2025',
                    rating: 5,
                    timeAgo: '50 минут',
                    isLiked: false,
                    isFavorited: false,
                    likesCount: 0,
                    favoritesCount: 0,
                    commentsCount: 0,
                    ingredients: ['чеснок'],
                },
                {
                    id: '3',
                    authorId: 'user1',
                    authorNickname: 'Da$ha',
                    authorAvatar: '/src/assets/avatar.svg',
                    image: '/src/assets/testPost2.png',
                    title: 'Картошка по деревенски',
                    description: 'Вкусная картошка с домашним майонезом и кетчупом, специями',
                    date: '28.01.2025',
                    rating: 3,
                    timeAgo: '50 минут',
                    isLiked: false,
                    isFavorited: false,
                    likesCount: 0,
                    favoritesCount: 0,
                    commentsCount: 0,
                    ingredients: ['говядина', 'соль', 'перец', 'розмарин']
                },
                {
                    id: '4',
                    authorId: 'user1',
                    authorNickname: 'm4ks',
                    authorAvatar: '/src/assets/avatar.svg',
                    image: '/src/assets/testPost2.png',
                    title: 'Картошка по деревенски',
                    description: 'Вкусная картошка с домашним майонезом и кетчупом, специями',
                    date: '15.02.2025',
                    rating: 2,
                    timeAgo: '50 минут',
                    isLiked: false,
                    isFavorited: false,
                    likesCount: 0,
                    favoritesCount: 0,
                    commentsCount: 0,
                    ingredients: ['говядина', 'соль', 'перец', 'розмарин']
                },
                {
                    id: '5',
                    authorId: 'user1',
                    authorNickname: 'kirYA',
                    authorAvatar: '/src/assets/avatar.svg',
                    image: '/src/assets/testPost2.png',
                    title: 'Картошка по деревенски',
                    description: 'Вкусная картошка с домашним майонезом и кетчупом, специями',
                    date: '14.01.2025',
                    rating: 4,
                    timeAgo: '50 минут',
                    isLiked: false,
                    isFavorited: false,
                    likesCount: 0,
                    favoritesCount: 0,
                    commentsCount: 0,
                    ingredients: ['говядина', 'соль', 'перец', 'розмарин']
                }
            ];

            // Имитация задержки
            await new Promise(resolve => setTimeout(resolve, 500));

            set(state => ({
                posts: reset ? mockPosts : [...state.posts, ...mockPosts],
                page: reset ? 2 : state.page + 1,
                hasMore: mockPosts.length === 10, // Если меньше 10, значит больше нет
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.message || 'Ошибка загрузки постов',
                isLoading: false
            });
        }
    },

    // Лайк поста
    likePost: async (postId: string) => {
        const { posts } = get();
        const post = posts.find(p => p.id === postId);

        if (!post) return;

        // Оптимистичное обновление UI
        set(state => ({
            posts: state.posts.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        isLiked: true,
                        likesCount: p.likesCount + 1
                    }
                    : p
            )
        }));

        try {
            // API запрос
            // await api.post(`/posts/${postId}/like`);
            console.log('Лайкнут пост:', postId);
        } catch (error) {
            // Откат при ошибке
            set(state => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? {
                            ...p,
                            isLiked: false,
                            likesCount: p.likesCount - 1
                        }
                        : p
                ),
                error: 'Не удалось поставить лайк'
            }));
        }
    },

    // Убрать лайк
    unlikePost: async (postId: string) => {
        const { posts } = get();
        const post = posts.find(p => p.id === postId);

        if (!post) return;

        set(state => ({
            posts: state.posts.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        isLiked: false,
                        likesCount: p.likesCount - 1
                    }
                    : p
            )
        }));

        try {
            // await api.delete(`/posts/${postId}/like`);
            console.log('Убран лайк:', postId);
        } catch (error) {
            set(state => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? {
                            ...p,
                            isLiked: true,
                            likesCount: p.likesCount + 1
                        }
                        : p
                ),
                error: 'Не удалось убрать лайк'
            }));
        }
    },

    // Добавить в избранное
    favoritePost: async (postId: string) => {
        set(state => ({
            posts: state.posts.map(p =>
                p.id === postId
                    ? { ...p, isFavorited: true, favoritesCount: p.favoritesCount + 1 }
                    : p
            )
        }));

        try {
            // await api.post(`/posts/${postId}/favorite`);
            console.log('Добавлено в избранное:', postId);
        } catch (error) {
            set(state => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? { ...p, isFavorited: false, favoritesCount: p.favoritesCount - 1 }
                        : p
                ),
                error: 'Не удалось добавить в избранное'
            }));
        }
    },

    // Убрать из избранного
    unfavoritePost: async (postId: string) => {
        set(state => ({
            posts: state.posts.map(p =>
                p.id === postId
                    ? { ...p, isFavorited: false, favoritesCount: p.favoritesCount - 1 }
                    : p
            )
        }));

        try {
            // await api.delete(`/posts/${postId}/favorite`);
            console.log('Убрано из избранного:', postId);
        } catch (error) {
            set(state => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? { ...p, isFavorited: true, favoritesCount: p.favoritesCount + 1 }
                        : p
                ),
                error: 'Не удалось убрать из избранного'
            }));
        }
    },

    // Подписка на автора
    subscribeToAuthor: async (authorId: string) => {
        try {
            // API запрос
            // await api.post(`/users/${authorId}/subscribe`);
            console.log('Подписка на автора:', authorId);

            // Можно показать уведомление?? для уточнения
            // useNotificationStore.getState().showSuccess('Вы подписались');
        } catch (error: any) {
            set({ error: error.message || 'Ошибка подписки' });
        }
    },

    clearError: () => set({ error: null })
}));