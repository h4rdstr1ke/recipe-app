import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import ProfileEdit from '../pages/ProfileEdit';
import PublicationPage from '../pages/PublicationPage'

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
            </Route>

            {/* Защищенные страницы (только для авторизованных) */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profileEdit" element={<ProfileEdit />} />
                </Route>
            </Route>
        </Routes>
    );
}