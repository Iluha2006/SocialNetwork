
import React from 'react';
export default function ErrorProfile({message, onClick}){




    return(

<div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                Ошибка загрузки профиля: {message}
                <button
                    onClick={onClick}
                    className="ml-4 text-blue-400 hover:underline"
                >
                    Повторить
                </button>
            </div>
    )

}