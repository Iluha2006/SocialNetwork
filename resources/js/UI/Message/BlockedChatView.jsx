
import React from 'react';


const BlockedChatView = ({

    message,
    onNavigateHome,
}) => {
    return (
        <div className="w-full max-w-lg mx-auto my-2.5 flex flex-col h-[900px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition-colors">


            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-sm">


                    <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <svg
                                className="w-6 h-6 text-red-500 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                                Доступ ограничен
                            </h3>
                        </div>
                        <p className="text-red-600 dark:text-red-400 text-sm leading-relaxed">
                            {message || 'Этот пользователь ограничил вам доступ к переписке'}
                        </p>
                    </div>


                    <button
                        onClick={onNavigateHome}
                        className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        aria-label="Вернуться на главную страницу"
                    >
                        Вернуться на главную
                    </button>


                </div>
            </div>
        </div>
    );
};



export default BlockedChatView;