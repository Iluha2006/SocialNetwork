import React from 'react';


function FriendButton  ({
    friendshipStatus,
    isLoading = false,
    disabled = false,
    onClick,
    className = ''
})  {
    const getButtonText = () => {
        const texts = {
            friends: 'В друзьях',
            request_sent: 'Заявка отправлена',
            request_received: 'Ответить на заявку',
            not_friends: 'Добавить в друзья',
        };
        return texts[friendshipStatus] || texts.not_friends;
    };

    const getButtonStyle = () => {
        const base = 'px-5 py-2.5 border-none rounded-lg text-sm font-medium cursor-pointer transition-all min-w-40';

        if (disabled || isLoading) {
            return `${base} opacity-60 cursor-not-allowed bg-gray-400 text-white`;
        }

        const styles = {
            friends: 'bg-green-500 hover:bg-green-600 text-white',
            request_sent: 'bg-yellow-500 hover:bg-yellow-600 text-white',
            request_received: 'bg-blue-500 hover:bg-blue-600 text-white',
            not_friends: 'bg-blue-500 hover:bg-blue-600 text-white',
        };

        return `${base} ${styles[friendshipStatus] || styles.not_friends}`;
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${getButtonStyle()} ${className}`}
        >
            {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            ) : (
                getButtonText()
            )}
        </button>
    );
};



export default FriendButton;