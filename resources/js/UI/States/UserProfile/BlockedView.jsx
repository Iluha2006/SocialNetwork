
import React from 'react';



function  BlockedView  ({
    title = "Доступ ограничен",
    message = "Вы не можете просматривать этот профиль, так как владелец ограничил вам доступ",
    showBackButton = true
}) {
    

    return (
        <div className="max-w-2xl mx-auto p-8 mt-10 text-center">
            <div className="bg-gray-800 rounded-xl p-8 border border-red-500/30">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 mx-auto text-red-500 mb-4"
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
                <p className="text-gray-400">{message}</p>

              
            </div>
        </div>
    );
};


export default BlockedView;