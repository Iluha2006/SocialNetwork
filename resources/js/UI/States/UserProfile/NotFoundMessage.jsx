
import React from 'react';
import { useNavigate } from 'react-router-dom';


function NotFoundMessage  ({
    text = "Профиль не найден",
    showBackButton = true,
    onBack
}) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate('/');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-5">
            <div className="text-center py-10">
                <svg
                    className="w-16 h-16 mx-auto text-gray-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <p className="text-white text-xl">{text}</p>

                {showBackButton && (
                    <button
                        onClick={handleBack}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Вернуться на главную
                    </button>
                )}
            </div>
        </div>
    );
};



export default NotFoundMessage;