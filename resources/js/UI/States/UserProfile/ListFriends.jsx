
import React from 'react';


function EmptyList  ({
    text = "Пока нет друзей",
    icon = "users",
    showAddButton = false,
    onAddFriend
})  {
    const getIconPath = () => {
        const icons = {
            users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            heart: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        };
        return icons[icon] || icons.users;
    };

    return (
        <div className="text-center py-8 text-gray-500">
            <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={getIconPath()}
                />
            </svg>
            <p className="text-sm">{text}</p>

            {showAddButton && onAddFriend && (
                <button
                    onClick={onAddFriend}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Найти друзей
                </button>
            )}
        </div>
    );
};



export default EmptyList;