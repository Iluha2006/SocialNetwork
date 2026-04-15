
import React from 'react';

 function  SendButton  ({
    onClick,
    disabled,
    isSending,
    hasContent,
    className = ''
})  {
    const isDisabled = disabled || (!hasContent && !isSending);

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            className={`
                p-3 rounded-full transition-all duration-200
                ${isDisabled
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer'
                }
                ${className}
            `}
            title="Отправить сообщение"
            aria-label="Отправить сообщение"
        >
            {isSending ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="transform rotate-45"
                    aria-hidden="true"
                >
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                </svg>
            )}
        </button>
    );
};



export default SendButton;