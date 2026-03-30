import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout.tsx';
import Home from '../pages/Home';
import Login from '../pages/Login.tsx';
import Register from '../pages/Register.tsx';
import Profile from '../pages/Profile.tsx';
import ProfileEdit from '../pages/ProfileEdit.tsx'; {/* Временно */ }

export default function AppRoutes() {
    return (
        <Routes>
            {/* Страницы с Layout (с Header) */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path='/profileEdit' element={<ProfileEdit />} />
                {/* другие страницы с хедером */}
            </Route>

            {/* Страницы без Layout (без Header) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}