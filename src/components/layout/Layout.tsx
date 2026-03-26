import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Header from '../header/Header';

export default function Layout() {
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    const hideHeader = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!hideHeader && (
                <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            )}
            <Outlet />
        </>
    );
}