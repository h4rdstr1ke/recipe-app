export interface User {
    id: string;
    email: string;
    nickname: string;
    name: string;
    avatarUrl?: string | null;
}

export interface UserSettings {
    allergens: string[];
    unwanted: string[];
    subscriptions: string[];
}

export interface TopAuthor {
    id: string;
    username: string;
    avatarUrl: string | null;
    postsCount: number;
    subscribersCount: number;
    ratingScore: number;
}

export interface Post {
    id: string;
    authorId: string;
    username: string;
    firstName: string;
    authorAvatar: string | null;
    image: string;
    title: string;
    description: string;
    date: string;
    rating?: {
        rating: number;
        quantity: number;
    };
    timeAgo: string;
    isLiked: boolean;
    isFavorited: boolean;
    likesCount: number;
    favoritesCount: number;
    commentsCount: number;
    nutrition?: {
        calories: number;
        protein: number;
        fat: number;
        carbs: number;
    };
    portions?: number;
    products?: {
        name: string;
        quantity: number;
        unit: 'шт' | 'г' | 'мл' | 'ст.л' | 'ч.л' | 'ст';
    }[];
    steps?: {
        stepNumber: number;
        description: string;
        image?: string;
    }[];
}

// Отдельный интерфейс для ответа
export interface Reply {
    id: string;
    author: string;
    text: string;
    likesCount: number;
    isLiked: boolean;
    createdAt: string;
}

// Интерфейс для главного комментария
export interface Comment {
    id: string;
    postId: string;
    author: string;
    text: string;
    imageUrl?: string;  // 
    likesCount: number;
    isLiked: boolean;
    createdAt: string;
    replies: Reply[];   // массив ответов
}