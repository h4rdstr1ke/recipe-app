import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const token = useAuthStore(state => state.token);
    const user = useAuthStore(state => state.user);

    // Если нет токена — отправляем на логин
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Если компонент требует конкретные роли, проверяем их
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = (user as any)?.role || 'User';
        if (!allowedRoles.includes(userRole)) {
            // Если роли не совпадают — кидаем на главную страницу
            return <Navigate to="/" replace />;
        }
    }

    // Если проверки пройдены пускаем дальше
    return <Outlet />;
}