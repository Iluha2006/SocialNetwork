
import React from 'react';

const AttachmentPreview = ({ image, file, onRemoveImage, onRemoveFile }) => {
    if (!image && !file) return null;

    return (
        <div className="absolute -top-20 left-0 right-0 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mx-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {image && (
                        <div className="flex items-center gap-2">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden ring-2 ring-blue-500/20">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Предпросмотр"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={onRemoveImage}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-sm"
                                    aria-label="Удалить изображение"
                                >
                                    ×
                                </button>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                                {image.name}
                            </span>
                        </div>
                    )}

                    {file && (
                        <div className="flex items-center gap-2">
                            <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center ring-2 ring-blue-500/20">
                                <span className="text-2xl" aria-hidden="true">📎</span>
                                <button
                                    type="button"
                                    onClick={onRemoveFile}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-sm"
                                    aria-label="Удалить файл"
                                >
                                    ×
                                </button>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[120px]">
                                {file.name}
                            </span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};



export default AttachmentPreview;