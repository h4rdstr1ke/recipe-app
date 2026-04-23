import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/FooterMobile';
import Helper from '../helperAI/Helper';

import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function Layout() {
    const location = useLocation();
    const hideHeader = location.pathname === '/login' || location.pathname === '/register';
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        // Каркас: flex-колонка высотой ровно в экран мобильного устройства (dvh учитывает панель адреса)
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-white">

            {/* Шапка */}
            {!hideHeader && (
                <div className="shrink-0">
                    <Header />
                </div>
            )}

            {/* Основной контент: занимает всё свободное место и имеет свой скролл */}
            <main className="flex-1 overflow-y-auto relative">
                <Outlet />
            </main>

            {!isMobile && (<Helper />)} {/* Временно */}

            {/* Футер лежит внизу */}
            {isMobile && (
                <div className="shrink-0">
                    <Footer />
                </div>
            )}

        </div>
    );
}