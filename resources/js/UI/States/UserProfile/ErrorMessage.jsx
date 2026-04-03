
import React from 'react';


function ErrorMessage ({ message, title = "Ошибка:", maxWidth = "max-w-7xl",onRetry }) {

    return (
        <div className={`${maxWidth} mx-auto p-5`}>
            <div className="bg-red-900 bg-opacity-20 border-l-4 border-red-500 text-red-300 p-4 rounded">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-semibold">{title}</p>
                        <p className="mt-1">{message}</p>
                    </div>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                            Повторить
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}





export default ErrorMessage;