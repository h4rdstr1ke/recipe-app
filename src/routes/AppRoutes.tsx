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
            </Route>

            {/* Защищенные страницы (только для авторизованных) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profileEdit" element={<ProfileEdit />} />
                    <Route path="/PostEdit" element={<PostEditPage />} />
                    <Route path="/PostCreate" element={<PostCreatePage />} />
                </Route>
            </Route>
        </Routes>
    );
}