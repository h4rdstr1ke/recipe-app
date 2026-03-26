import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout.tsx';
import Home from '../pages/Home';
import Login from '../pages/Login.tsx';
import Register from '../pages/Register.tsx';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Страницы с Layout (с Header) */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                {/* другие страницы с хедером */}
            </Route>

            {/* Страницы без Layout (без Header) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}