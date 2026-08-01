
import React, { memo } from 'react';

const ImageModal = memo(({ image, onClose }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
        <button
            className="absolute top-4 right-4 text-white text-3xl w-10 h-10 flex items-center justify-center bg-red-500 rounded-full z-50 transition-colors hover:bg-red-600"
            onClick={onClose}
        >
            ×
        </button>
        <img
            src={image}
            alt="Просмотр фото"
            className="max-w-full max-h-[120vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
        />
    </div>
));

export default ImageModal;
