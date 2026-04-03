import React from 'react';
import { useNavigate } from 'react-router-dom';


function PrivateProfileView  ({
    title = "Профиль скрыт",
    message,
    showBackButton = true,
    visibility = "private"
})  {
    const navigate = useNavigate();

    const getIconColor = () => {
        switch (visibility) {
            case 'friends': return 'text-blue-500 border-blue-500/30';
            case 'private': return 'text-yellow-500 border-yellow-500/30';
            default: return 'text-gray-500 border-gray-500/30';
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-8 mt-10 text-center">
            <div className={`bg-gray-800 rounded-xl p-8 border ${getIconColor()}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-24 w-24 mx-auto mb-4 ${getIconColor().split(' ')[0]}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                </svg>
                <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
                <p className="text-gray-400">
                    {message || "Владелец профиля ограничил доступ к своей информации."}
                </p>

                {showBackButton && (
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Вернуться на главную
                    </button>
                )}
            </div>
        </div>
    );
};


export default PrivateProfileView;