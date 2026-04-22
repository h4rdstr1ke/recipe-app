import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header/Header';
import Helper from '../helperAI/Helper'

export default function Layout() {
    const location = useLocation();

    const hideHeader = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!hideHeader && (
                <Header />
            )}
            <Outlet />
            <Helper /> {/* Временно */}
        </>
    );
}