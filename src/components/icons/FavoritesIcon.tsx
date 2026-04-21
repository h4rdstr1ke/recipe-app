import React from 'react';

interface FavoritesIconProps {
    isFavorited: boolean;
    className?: string;
    onClick?: () => void;
}

export const FavoritesIcon: React.FC<FavoritesIconProps> = ({ isFavorited, className = '', onClick }) => {
    return (
        <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-colors duration-200 ${className}`}
            onClick={onClick}
        >
            {/* Нижний слой (центр). Прозрачный, если нет в избранном, и цветной, если есть */}
            <path
                className={isFavorited ? 'fill-current' : 'fill-transparent'}
                d="M23.9577 25L12.4993 13.5969L1.04102 25V3.125C1.04102 2.2962 1.37026 1.50134 1.95631 0.915291C2.54236 0.32924 3.33721 0 4.16602 0L20.8327 0C21.6615 0 22.4563 0.32924 23.0424 0.915291C23.6284 1.50134 23.9577 2.2962 23.9577 3.125V25Z"
            />

            {/* Верхний слой (сам контур). Всегда берет цвет из родительского тега */}
            <path
                className="fill-current"
                d="M23.9577 25L12.4993 13.5969L1.04102 25V3.125C1.04102 2.2962 1.37026 1.50134 1.95631 0.915291C2.54236 0.32924 3.33721 0 4.16602 0L20.8327 0C21.6615 0 22.4563 0.32924 23.0424 0.915291C23.6284 1.50134 23.9577 2.2962 23.9577 3.125V25ZM12.4993 10.6583L21.8743 19.9844V3.125C21.8743 2.84873 21.7646 2.58378 21.5693 2.38843C21.3739 2.19308 21.1089 2.08333 20.8327 2.08333H4.16602C3.88975 2.08333 3.6248 2.19308 3.42945 2.38843C3.2341 2.58378 3.12435 2.84873 3.12435 3.125V19.9844L12.4993 10.6583Z"
            />
        </svg>
    );
};