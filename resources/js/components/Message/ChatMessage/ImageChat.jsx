

import React, { useState, useRef } from 'react';

const ImageMessage = ({ onImageSelect, disabled = false }) => {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleIconClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.match('image.*')) {
            alert('Пожалуйста, выберите изображение (JPG, PNG, GIF)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { 
            alert('Размер изображения не должен превышать 5MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreview(event.target.result);

            onImageSelect?.(file);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleRemove = () => {
        setPreview(null);
        onImageSelect?.(null);
    };

    return (
        <div className="relative">
       
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
            />
  <button
                type="button"
                onClick={handleIconClick}
                disabled={disabled}
                className={`p-2 rounded-full transition-colors ${
                    disabled 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Прикрепить изображение"
                aria-label="Прикрепить изображение"
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="currentColor" 
                    viewBox="0 0 16 16"
                >
                    <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
                    <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
                </svg>
            </button>

         
           
          
        </div>
    );
};

export default ImageMessage;