import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/FooterMobile';
import Helper from '../helperAI/Helper';

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useEffect, useRef } from 'react';

// Отключаем браузерный автоскролл глобально для всего приложения
if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

export default function Layout() {
    const location = useLocation();
    const hideHeader = location.pathname === '/login' || location.pathname === '/register';
    const isMobile = useMediaQuery('(max-width: 768px)');

    // РЕФ ДЛЯ СКРОЛЛИРУЕМОГО КОНТЕЙНЕРА
    const mainRef = useRef<HTMLElement>(null);

    // ГЛОБАЛЬНЫЙ КОНТРОЛЛЕР СКРОЛЛА
    useEffect(() => {
        // Если меняется URL и в нем НЕТ хэша (якоря типа #step-2),
        // обращаемся напрямую к тегу <main> 
        if (!location.hash && mainRef.current) {
            mainRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, [location.pathname, location.hash]);

    return (
        // Каркас: flex-колонка высотой ровно в экран мобильного устройства (dvh учитывает панель адреса)
        <div className="flex flex-col h-[100svh] overflow-hidden bg-white">

            {/* Шапка */}
            {!hideHeader && (
                <div className="shrink-0">
                    <Header />
                </div>
            )}

            {/* Основной контент: занимает всё свободное место и имеет свой скролл */}
            <main ref={mainRef} className="flex-1 overflow-y-auto relative overscroll-none">
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