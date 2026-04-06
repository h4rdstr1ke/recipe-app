import { create } from 'zustand';

// Общие мок-данные 
const MOCK_POSTS: Post[] = [
    {
        id: '1',
        authorId: 'user1',
        authorNickname: 'vlad228',
        authorAvatar: '/src/assets/avatar.svg',
        image: '/src/assets/testPost2.png',
        title: 'Картошка по деревенски',
        description: 'Вкусная картошка с домашним майонезом и кетчупом, специями',
        date: '27.01.2025',
        rating: 4,
        timeAgo: '50 минут',
        isLiked: false,
        isFavorited: false,
        likesCount: 42,
        favoritesCount: 15,
        commentsCount: 7,
        ingredients: ['чеснок', 'молоко', 'острое', 'картофель', 'майонез'],
        nutrition: {
            calories: 320,
            protein: 8,
            fat: 12,
            carbs: 45
        },
        products: [
            { name: 'Картофель', quantity: 500, unit: 'г' },
            { name: 'Чеснок', quantity: 3, unit: 'г' },
            { name: 'Масло растительное', quantity: 50, unit: 'мл' },
            { name: 'Соль', quantity: 1, unit: 'ч.л' },
            { name: 'Перец', quantity: 0.5, unit: 'ч.л' },
            { name: 'Паприка', quantity: 1, unit: 'ч.л' }
        ],
        steps: [
            { stepNumber: 1, description: 'Картофель вымыть и почистить', image: '/steps/potato1.png' },
            { stepNumber: 2, description: 'Нарезать картофель дольками', image: '/steps/potato2.png' },
            { stepNumber: 3, description: 'Смешать с маслом и специями', image: '/steps/potato3.png' },
            { stepNumber: 4, description: 'Выложить на противень и запекать 40 минут при 200°C', image: '/steps/potato4.png' }
        ]
    },
    {
        id: '2',
        authorId: 'user2',
        authorNickname: 'ira000',
        authorAvatar: '/src/assets/avatar.svg',
        image: '/src/assets/testPost2.png',
        title: 'Паста карбонара',
        description: 'Классическая итальянская паста с беконом и пармезаном',
        date: '26.01.2025',
        rating: 5,
        timeAgo: '35 минут',
        isLiked: false,
        isFavorited: false,
        likesCount: 128,
        favoritesCount: 45,
        commentsCount: 23,
        ingredients: ['паста', 'бекон', 'пармезан', 'яйца', 'черный перец']
    },
    {
        id: '3',
        authorId: 'user3',
        authorNickname: 'Da$ha',
        authorAvatar: '/src/assets/avatar.svg',
        image: '/src/assets/testPost2.png',
        title: 'Салат Цезарь',
        description: 'Свежий салат с курицей, сухариками и соусом Цезарь',
        date: '28.01.2025',
        rating: 5,
        timeAgo: '20 минут',
        isLiked: false,
        isFavorited: false,
        likesCount: 89,
        favoritesCount: 32,
        commentsCount: 12,
        ingredients: ['курица', 'салат романо', 'сухарики', 'пармезан', 'соус цезарь']
    },
    {
        id: '4',
        authorId: 'user4',
        authorNickname: 'm4ks',
        authorAvatar: '/src/assets/avatar.svg',
        image: '/src/assets/testPost2.png',
        title: 'Борщ',
        description: 'Наваристый украинский борщ со свеклой и сметаной',
        date: '15.02.2025',
        rating: 3,
        timeAgo: '120 минут',
        isLiked: false,
        isFavorited: false,
        likesCount: 256,
        favoritesCount: 98,
        commentsCount: 45,
        ingredients: ['свекла', 'капуста', 'картофель', 'морковь', 'лук', 'говядина']
    },
    {
        id: '5',
        authorId: 'user5',
        authorNickname: 'kirYA',
        authorAvatar: '/src/assets/avatar.svg',
        image: '/src/assets/testPost2.png',
        title: 'Блины',
        description: 'Тонкие блины на молоке с дырочками',
        date: '14.01.2025',
        rating: 4,
        timeAgo: '30 минут',
        isLiked: false,
        isFavorited: false,
        likesCount: 67,
        favoritesCount: 23,
        commentsCount: 8,
        ingredients: ['молоко', 'яйца', 'мука', 'сахар', 'соль', 'масло']
    }
];

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

    nutrition?: {           // ? - опционально
        calories: number;
        protein: number;
        fat: number;
        carbs: number;
    };
    products?: {            // продукты для приготовления
        name: string;
        quantity: number;
        unit: 'шт' | 'г' | 'мл' | 'ст.л' | 'ч.л' | 'ст';
    }[];
    steps?: {               // пошаговый рецепт
        stepNumber: number;
        description: string;
        image?: string;     // фото шага 
    }[];
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
    fetchPostById: (id: string) => Promise<Post | null>; // Для страницы поста
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

        try {
            // Имитация задержки
            await new Promise(resolve => setTimeout(resolve, 500));

            set(state => ({
                posts: reset ? MOCK_POSTS : [...state.posts, ...MOCK_POSTS],
                page: reset ? 2 : state.page + 1,
                hasMore: false, // Так как все посты уже загружены
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

    // Для загрузки одного поста
    fetchPostById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            // Ищем среди уже загруженных постов
            const { posts } = get();
            const existingPost = posts.find(p => p.id === id);

            if (existingPost) {
                set({ isLoading: false });
                return existingPost;
            }

            // ИСПОЛЬЗУЕМ MOCK_POSTS
            const mockPost = MOCK_POSTS.find(p => p.id === id);

            set({ isLoading: false });
            return mockPost || null;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            return null;
        }
    },

    clearError: () => set({ error: null })
}));