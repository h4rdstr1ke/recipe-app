import type { Comment, Post, TopAuthor, UserSettings } from '../types/index';
import type { AppNotification } from '../types/index';
import testPostImage from '../assets/test/testPost2.png';
import testBowlImage from '../assets/test/bowl.jpg'
import testBurgerImage from '../assets/test/burger.jpg'
import testFoundanImage from '../assets/test/fondan.png'
import testPastaImage from '../assets/test/pasta_karbonara.png'
import testRamenImage from '../assets/test/ramen.jpg'
import testSteikImage from '../assets/test/steik.png'
//import DefaultAvatar from '../assets/defaultAvatar.svg'
import catAvatar from '../assets/test/catAvatar.jpg'
import testAvatar1 from '../assets/test/testAvatar1.jpg'
import testAvatar2 from '../assets/test/testAvatar2.jpg'
import testAvatar3 from '../assets/test/testAvatar3.jpg'
import testAvatar4 from '../assets/test/testAvatar4.jpg'
import testAvatar5 from '../assets/test/testAvatar5.jpeg'
import testAvatar6 from '../assets/test/testAvatar6.jpg'

export const MOCK_USERS = {
    'user1': {
        id: 'user1',
        username: 'vlad228',
        firstName: 'Владислав',
        authorAvatar: catAvatar,
        bio: 'Привет! Я Влад, люблю готовить стейки и делиться рецептами!',
        subscriptions: ['user2', 'user5', 'user3', 'user7']
    },
    'user2': {
        id: 'user2',
        username: 'ira000',
        firstName: 'Ирина',
        authorAvatar: testAvatar1,
        bio: 'Фанатка итальянской кухни и пасты Карбонара',
        subscriptions: ['user1', 'user5']
    },
    'user3': {
        id: 'user3',
        username: 'da$ha',
        firstName: 'Дарья',
        authorAvatar: testAvatar2,
        bio: 'Начинающий кулинар, обожаю печь тортики',
        subscriptions: ['user3', 'user1, user6']

    },
    'user4': {
        id: 'user4',
        username: 'm4ks',
        firstName: 'Максим',
        authorAvatar: testAvatar3,
        bio: 'Ем, чтобы жить. Готовлю, чтобы есть вкусно',
        subscriptions: ['user2', 'user5', 'user6', 'user7']
    },
    'user5': {
        id: 'user5',
        username: 'kirya',
        firstName: 'Кирилл',
        authorAvatar: testAvatar4,
        bio: 'Спортсмен, составляю рацион из полезных продукто',
        subscriptions: ['user1']
    },
    'user6': {
        id: 'user6',
        username: 'moto',
        firstName: 'Николай',
        authorAvatar: testAvatar5,
        bio: 'Гриль-мастер, любитель барбекю и острых соусов',
        subscriptions: ['user1']
    },
    'user7': {
        id: 'user7',
        username: 'wisow',
        firstName: 'Софья',
        authorAvatar: testAvatar6,
        bio: 'Ищу идеальный рецепт круассанов',
        subscriptions: []
    }
} as const;

export const MOCK_POSTS: Post[] = [
    {
        id: '1',
        authorId: MOCK_USERS['user1'].id,
        username: MOCK_USERS['user1'].username,
        firstName: MOCK_USERS['user1'].firstName,
        authorAvatar: MOCK_USERS['user1'].authorAvatar,
        image: testPostImage,
        title: 'Картошка по-деревенски',
        description: 'Вкусная картошка с домашним майонезом и кетчупом, специями',
        date: '21.01.2025',
        rating: { rating: 4, quantity: 3 },
        timeCooking: '50 минут',
        mealType: 'Завтрак',
        dishType: 'Первые блюда',
        likesCount: 42,
        favoritesCount: 15,
        commentsCount: 7,
        portions: 1,
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
        image: testPastaImage,
        title: 'Классическая паста Карбонара',
        description: 'Настоящая итальянская классика без сливок. Только желтки, пармезан и гуанчиале.',
        date: '28.01.2025',
        rating: { rating: 5, quantity: 12 },
        timeCooking: '2 часа',
        mealType: 'Завтрак',
        dishType: 'Первые блюда',
        likesCount: 128,
        favoritesCount: 45,
        commentsCount: 22,
        portions: 2,
        nutrition: { calories: 550, protein: 22, fat: 30, carbs: 60 },
        products: [
            { name: 'Спагетти', quantity: 200, unit: 'г' },
            { name: 'Яичный желток', quantity: 3, unit: 'шт' },
            { name: 'Пармезан', quantity: 50, unit: 'г' }
        ],
        steps: [
            { stepNumber: 1, description: 'Отварить пасту до состояния аль-денте', image: '/steps/pasta1.png' }
        ]
    },
    {
        id: '3',
        authorId: MOCK_USERS['user3'].id,
        username: MOCK_USERS['user3'].username,
        firstName: MOCK_USERS['user3'].firstName,
        authorAvatar: MOCK_USERS['user3'].authorAvatar,
        image: testBowlImage,
        title: 'Зеленый смузи боул',
        description: 'Идеальный полезный завтрак для заряда энергией на весь день.',
        date: '29.01.2025',
        rating: { rating: 4, quantity: 8 },
        timeCooking: '3 часа',
        mealType: 'Завтрак',
        dishType: 'Первые блюда',
        likesCount: 89,
        favoritesCount: 30,
        commentsCount: 5,
        portions: 1,
        nutrition: { calories: 210, protein: 5, fat: 4, carbs: 38 },
        products: [
            { name: 'Шпинат', quantity: 100, unit: 'г' },
            { name: 'Банан', quantity: 1, unit: 'шт' }
        ],
        steps: [
            { stepNumber: 1, description: 'Взбить все ингредиенты в блендере до однородности', image: '/steps/smoothie1.png' }
        ]
    },
    {
        id: '4',
        authorId: MOCK_USERS['user4'].id,
        username: MOCK_USERS['user4'].username,
        firstName: MOCK_USERS['user4'].firstName,
        authorAvatar: MOCK_USERS['user4'].authorAvatar,
        image: testSteikImage,
        title: 'Стейк Рибай с маслом',
        description: 'Сочный стейк средней прожарки с ароматным чесночным маслом.',
        date: '29.01.2025',
        rating: { rating: 5, quantity: 25 },
        timeCooking: '6 часов',
        mealType: 'Завтрак',
        dishType: 'Первые блюда',
        likesCount: 210,
        favoritesCount: 67,
        commentsCount: 18,
        portions: 1,
        nutrition: { calories: 600, protein: 45, fat: 48, carbs: 0 },
        products: [
            { name: 'Говяжий стейк', quantity: 350, unit: 'г' },
            { name: 'Сливочное масло', quantity: 30, unit: 'г' }
        ],
        steps: [
            { stepNumber: 1, description: 'Обжарить мясо на раскаленной сковороде по 3 минуты с каждой стороны', image: '/steps/steak1.png' }
        ]
    },
    {
        id: '5',
        authorId: MOCK_USERS['user5'].id,
        username: MOCK_USERS['user5'].username,
        firstName: MOCK_USERS['user5'].firstName,
        authorAvatar: MOCK_USERS['user5'].authorAvatar,
        image: testRamenImage,
        title: 'Домашний Рамен',
        description: 'Наваристый бульон, который варился 12 часов. Тот самый вкус из аниме.',
        date: '30.01.2025',
        rating: { rating: 4, quantity: 15 },
        timeCooking: '1 день',
        mealType: 'Завтрак',
        dishType: 'Первые блюда',
        likesCount: 156,
        favoritesCount: 82,
        commentsCount: 31,
        portions: 2,
        nutrition: { calories: 480, protein: 28, fat: 18, carbs: 52 },
        products: [
            { name: 'Пшеничная лапша', quantity: 150, unit: 'г' },
            { name: 'Свиная грудинка', quantity: 100, unit: 'г' }
        ],
        steps: [
            { stepNumber: 1, description: 'Залить лапшу готовым горячим бульоном и добавить топпинги', image: '/steps/ramen1.png' }
        ]
    },
    {
        id: '6',
        authorId: MOCK_USERS['user6'].id,
        username: MOCK_USERS['user6'].username,
        firstName: MOCK_USERS['user6'].firstName,
        authorAvatar: MOCK_USERS['user6'].authorAvatar,
        image: testBurgerImage,
        title: 'Бургер "Черная Мамба"',
        description: 'Бургер с карамелизированным луком, беконом и сыром дорблю.',
        date: '30.01.2025',
        rating: { rating: 5, quantity: 40 },
        timeCooking: '1 день',
        mealType: 'Завтрак',
        dishType: 'Первые блюда',
        likesCount: 320,
        favoritesCount: 110,
        commentsCount: 45,
        portions: 1,
        nutrition: { calories: 850, protein: 35, fat: 55, carbs: 40 },
        products: [
            { name: 'Булочка бриошь', quantity: 1, unit: 'шт' },
            { name: 'Фарш говяжий', quantity: 180, unit: 'г' }
        ],
        steps: [
            { stepNumber: 1, description: 'Сформировать котлету и обжарить до Medium Rare', image: '/steps/burger1.png' }
        ]
    },
    {
        id: '7',
        authorId: MOCK_USERS['user7'].id,
        username: MOCK_USERS['user7'].username,
        firstName: MOCK_USERS['user7'].firstName,
        authorAvatar: MOCK_USERS['user7'].authorAvatar,
        image: testFoundanImage,
        title: 'Шоколадный Фондан',
        description: 'Десерт с жидким центром. Подавать строго с шариком ванильного мороженого.',
        date: '31.01.2025',
        rating: { rating: 5, quantity: 50 },
        timeCooking: '2 дня',
        mealType: 'Завтрак',
        dishType: 'Первые блюда',
        likesCount: 540,
        favoritesCount: 230,
        commentsCount: 12,
        portions: 1,
        nutrition: { calories: 420, protein: 6, fat: 28, carbs: 36 },
        products: [
            { name: 'Темный шоколад', quantity: 100, unit: 'г' },
            { name: 'Мука', quantity: 40, unit: 'г' }
        ],
        steps: [
            { stepNumber: 1, description: 'Выпекать при 200°C ровно 8 минут', image: '/steps/fondant1.png' }
        ]
    }
];

export const MOCK_TOP_AUTHORS: TopAuthor[] = [
    {
        id: MOCK_USERS['user1'].id,
        username: MOCK_USERS['user1'].username,
        avatarUrl: MOCK_USERS['user1'].authorAvatar,
        postsCount: 2,
        subscribersCount: 16,
        ratingScore: 121,
    },
    {
        id: MOCK_USERS['user2'].id,
        username: MOCK_USERS['user2'].username,
        avatarUrl: MOCK_USERS['user2'].authorAvatar,
        postsCount: 29,
        subscribersCount: 423,
        ratingScore: 4533,
    },
    {
        id: MOCK_USERS['user3'].id,
        username: MOCK_USERS['user3'].username,
        avatarUrl: MOCK_USERS['user3'].authorAvatar,
        postsCount: 14,
        subscribersCount: 254,
        ratingScore: 4100,
    },
    {
        id: MOCK_USERS['user4'].id,
        username: MOCK_USERS['user4'].username,
        avatarUrl: MOCK_USERS['user4'].authorAvatar,
        postsCount: 45,
        subscribersCount: 123,
        ratingScore: 3200,
    },
    {
        id: MOCK_USERS['user5'].id,
        username: MOCK_USERS['user5'].username,
        avatarUrl: MOCK_USERS['user5'].authorAvatar,
        postsCount: 75,
        subscribersCount: 571,
        ratingScore: 3133,
    },
    {
        id: MOCK_USERS['user6'].id,
        username: MOCK_USERS['user6'].username,
        avatarUrl: MOCK_USERS['user6'].authorAvatar,
        postsCount: 5,
        subscribersCount: 23,
        ratingScore: 970,
    },
    {
        id: MOCK_USERS['user7'].id,
        username: MOCK_USERS['user7'].username,
        avatarUrl: MOCK_USERS['user7'].authorAvatar,
        postsCount: 19,
        subscribersCount: 21,
        ratingScore: 653,
    }
];

export const MOCK_USER_SETTINGS: UserSettings = {
    allergens: ['Картофель', 'Орехи'],
    unwanted: ['Чеснок', 'Мука'],
    subscriptions: [...MOCK_USERS['user1'].subscriptions], // id авторов, на которых подписан
    likedPosts: ['2', '5', '7'],
    favoritePosts: ['2', '4', '7'],
};

export const MOCK_COMMENTS: Comment[] = [
    {
        id: '1',
        postId: '1',
        author: 'vlad228',
        text: "Ну пойдет",
        imageUrl: testPostImage,
        likesCount: 11,
        isLiked: false,
        createdAt: '27.01.2024 в 14:30',
        replies: [
            {
                id: '101',
                author: 'ira000',
                text: 'Вкусняшка',
                likesCount: 5,
                isLiked: false,
                createdAt: '27.01.2024 в 15:01',
                // Вложенный ответ на ответ
                replies: [
                    {
                        id: '101-1',
                        author: 'vlad228',
                        text: 'Рад, что понравилось!',
                        likesCount: 2,
                        isLiked: true,
                        createdAt: '28.01.2024 в 15:05',
                        replies: []
                    }
                ]
            }
        ]
    },
    {
        id: '2',
        postId: '1',
        author: MOCK_USERS['user4'].username,
        text: "Ну пойдет",
        imageUrl: testPostImage,
        likesCount: 1,
        isLiked: false,
        createdAt: '29.01.2024 в 17:45',
        replies: []
    },
    {
        id: '3',
        postId: '1',
        author: MOCK_USERS['user2'].username,
        text: "Пу пу пу",
        imageUrl: testPostImage,
        likesCount: 31,
        isLiked: false,
        createdAt: '27.01.2024 в 18:07',
        replies: []
    },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
    {
        id: 'notif_1',
        type: 'SUBSCRIBE',
        createdAt: '29 марта',
        isRead: false,
        actorId: 'user2',
    },
    {
        id: 'notif_2',
        type: 'LIKE',
        createdAt: '29 марта',
        isRead: false,
        actorId: 'user3', // Ссылаемся на user3
        postId: '1',      // Ссылаемся на конкретный пост 
    },
    {
        id: 'notif_3',
        type: 'COMMENT',
        createdAt: '29 марта',
        isRead: true,
        actorId: 'user3',
        postId: '1',
        message: 'Огонь, рецепт супер! Обязательно попробую приготовить на выходных.'
    },
    {
        id: 'notif_4',
        type: 'WARNING',
        createdAt: '27 марта',
        isRead: true,
        message: 'Ваша публикация была удалена из-за нарушения правил сайта. Следующее нарушение приведет к удалению аккаунта.'
    },
    {
        id: 'notif_5',
        type: 'REPORT',
        createdAt: '26 марта',
        isRead: true,
        message: 'Мы рассмотрим Вашу жалобу и примем меру в случае нарушения. Спасибо!'
    }
];