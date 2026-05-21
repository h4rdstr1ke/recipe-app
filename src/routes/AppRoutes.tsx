import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import ProfileEdit from '../pages/ProfileEdit';
import PublicationPage from '../pages/PublicationPage'
import TopAuthorsPage from '../pages/TopAuthorsPage';

import PostEditPage from '../pages/PostEditPage';
import PostCreatePage from '../pages/PostCreatePage';
import ModeratorPage from '../pages/ModeratorPage';
import OnboardingPage from '../pages/OnboardingPage';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Публичные страницы (доступны всем) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Страница с Layout(шапкой) */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/publication/:id" element={<PublicationPage />} />
                <Route path="/topAuthors" element={<TopAuthorsPage />} />
                <Route path="/profile/:id?" element={<Profile />} />
                {/* Обычные защищенные страницы (любой авторизованный) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profileEdit" element={<ProfileEdit />} />
                    <Route path="/PostEdit/:id" element={<PostEditPage />} />
                    <Route path="/PostCreate" element={<PostCreatePage />} />
                </Route>
                {/* Роуты модерации (Только для админов/модераторов) */}
                <Route element={<ProtectedRoute allowedRoles={['Moderator', 'Admin']} />}>
                    <Route path="/moderator" element={<ModeratorPage />} />
                </Route>
            </Route>
            <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>
        </Routes>
    );
}