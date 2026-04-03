
import React from 'react';


function LoadingSpinner  ({
    text = "Загрузка",
    size = "h-12 w-12",
    color = "border-blue-500",
    textColor = "text-white"
})  {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className={`inline-block animate-spin rounded-full ${size} border-b-2 ${color} mb-4`}></div>
                <p className={`${textColor}`}>{text}</p>
            </div>
        </div>
    );
};



export default LoadingSpinner;