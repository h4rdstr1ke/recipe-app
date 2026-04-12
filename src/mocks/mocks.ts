import type { Comment, Post, TopAuthor, UserSettings } from '../types';

export const MOCK_USERS = {
    'user1': {
        id: 'user1',
        username: 'vlad228',
        firstName: 'Владислав',
        authorAvatar: '/src/assets/avatar.svg',
    },
    'user2': {
        id: 'user2',
        username: 'ira000',
        firstName: 'Ирина',
        authorAvatar: '/src/assets/avatar.svg',
    }
} as const;

export const MOCK_POSTS: Post[] = [
    {
        id: '1',
        authorId: MOCK_USERS['user1'].id,
        username: MOCK_USERS['user1'].username,
        firstName: MOCK_USERS['user1'].firstName,
        authorAvatar: MOCK_USERS['user1'].authorAvatar,
        image: '/src/assets/testPost2.png',
        title: 'Картошка по-деревенски',
        description: 'Вкусная картошка с домашним майонезом и кетчупом, специями',
        date: '27.01.2025',
        rating: { rating: 4, quantity: 3 },
        timeAgo: '50 минут',
        isLiked: false,
        isFavorited: false,
        likesCount: 42,
        favoritesCount: 15,
        commentsCount: 7,
        ingredients: ['чеснок', 'молоко', 'острое', 'картофель', 'майонез'],
        nutrition: { calories: 320, protein: 8, fat: 12, carbs: 45 },
        products: [
            { name: 'Картофель', quantity: 500, unit: 'г' },
            { name: 'Чеснок', quantity: 3, unit: 'г' }
        ],
        steps: [
            { stepNumber: 1, description: 'Картофель вымыть и почистить', image: '/steps/potato1.png' }
        ]
    },
    {
        id: '2',
        authorId: MOCK_USERS['user2'].id,
        username: MOCK_USERS['user2'].username,
        firstName: MOCK_USERS['user2'].firstName,
        authorAvatar: MOCK_USERS['user2'].authorAvatar,
        image: '/src/assets/testPost2.png',
        title: 'Картошка по-деревенски',
        description: 'Вкусная картошка с домашним майонезом и кетчупом, специями',
        date: '27.01.2025',
        rating: { rating: 4, quantity: 3 },
        timeAgo: '50 минут',
        isLiked: false,
        isFavorited: false,
        likesCount: 42,
        favoritesCount: 15,
        commentsCount: 7,
        ingredients: ['чеснок', 'молоко', 'острое', 'картофель', 'майонез'],
        nutrition: { calories: 320, protein: 8, fat: 12, carbs: 45 },
        products: [
            { name: 'Картофель', quantity: 500, unit: 'г' },
            { name: 'Чеснок', quantity: 3, unit: 'г' }
        ],
        steps: [
            { stepNumber: 1, description: 'Картофель вымыть и почистить', image: '/steps/potato1.png' }
        ]
    },

    // остальные посты
];

export const MOCK_TOP_AUTHORS: TopAuthor[] = [
    {
        id: MOCK_USERS['user1'].id,
        username: MOCK_USERS['user1'].username,
        avatarUrl: MOCK_USERS['user1'].authorAvatar,
        postsCount: 29,
        subscribersCount: 323,
        ratingScore: 4333,
    },
    {
        id: MOCK_USERS['user2'].id,
        username: MOCK_USERS['user2'].username,
        avatarUrl: MOCK_USERS['user2'].authorAvatar,
        postsCount: 29,
        subscribersCount: 323,
        ratingScore: 4533,
    }
];

export const MOCK_USER_SETTINGS: UserSettings = {
    allergens: ['молоко', 'орехи'],
    unwanted: ['чеснок', 'острое'],
    subscriptions: [MOCK_USERS['user1'].id] // id авторов, на которых подписан
};

export const MOCK_COMMENTS: Comment[] = [
    {
        id: '1',
        postId: MOCK_POSTS[0].id,
        author: MOCK_USERS['user1'].username,
        text: "Ну пойдет",
        imageUrl: '/src/assets/testPost2.png',
        likesCount: 11,
        isLiked: false,
        createdAt: '27.01.2024',
        replies: [ // Массив
            {
                id: '101', // Уникальный ID ответа
                author: MOCK_USERS['user2'].username,
                text: 'Вкусняшка',
                likesCount: 5,
                isLiked: false,
                createdAt: '27.01.2024'
            },
            {
                id: '102', // Уникальный ID ответа
                author: MOCK_USERS['user2'].username,
                text: 'Наверно',
                likesCount: 1,
                isLiked: false,
                createdAt: '27.01.2024'
            }
        ]
    }
];