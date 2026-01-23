import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserImages } from '../../../store/ImagesStore';

const UserImages = ({ userId, compact = false }) => {
    const dispatch = useDispatch();
    const { userImages, imagesLoading } = useSelector(state => state.images);

    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentUserImages = userImages && userImages[userId] ? userImages[userId] : [];


    useEffect(() => {
        if (userId) {
            dispatch(fetchUserImages(parseInt(userId)));
        }
    }, [dispatch, userId]);

    const openModal = (image, index) => {
        setSelectedImage(image);
        setCurrentIndex(index);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setCurrentIndex(0);
    };

    const goToNextImage = () => {
        if (currentUserImages.length > 0) {
            const nextIndex = (currentIndex + 1) % currentUserImages.length;
            setSelectedImage(currentUserImages[nextIndex]);
            setCurrentIndex(nextIndex);
        }
    };

    const goToPrevImage = () => {
        if (currentUserImages.length > 0) {
            const prevIndex = (currentIndex - 1 + currentUserImages.length) % currentUserImages.length;
            setSelectedImage(currentUserImages[prevIndex]);
            setCurrentIndex(prevIndex);
        }
    };


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage) return;

            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowRight':
                    goToNextImage();
                    break;
                case 'ArrowLeft':
                    goToPrevImage();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, currentIndex, currentUserImages]);


    if (compact) {
        return (
            <div className="user-images-compact">
                <h3 className="text-lg font-semibold text-white mb-3">Фотографии</h3>
                {imagesLoading ? (
                    <div className="text-gray-400">Загрузка...</div>
                ) : currentUserImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {currentUserImages.slice(0, 6).map((image, index) => (
                            <img
                                key={image.id}
                                src={image.path_image}
                                alt={`Фото ${index + 1}`}
                                className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-90"
                                onClick={() => openModal(image, index)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-400 italic">Нет фотографий</div>
                )}
            </div>
        );
    }


    return (
        <div className="rounded-xl p-4 mb-5 max-w-7xl shadow-lg " style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>
            <h3 className="text-xl font-semibold text-gray-200 mb-5">Фотографии пользователя</h3>

            {imagesLoading ? (
                <div className="text-center py-10 text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                    <p>Загрузка фотографий...</p>
                </div>
            ) : currentUserImages.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {currentUserImages.map((image, index) => (
                            <div
                                key={image.id}
                                className="relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                                onClick={() => openModal(image, index)}
                            >
                                <img
                                    src={image.path_image}
                                    alt={`Фото ${index + 1}`}
                                    className="w-full h-48 object-cover block"
                                    loading="lazy"
                                />

                            </div>
                        ))}
                    </div>


                    {currentUserImages.length > 10 && (
                        <div className="mt-4 text-center text-gray-300">
                            Показано {Math.min(currentUserImages.length, 15)} из {currentUserImages.length} фотографий
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-10 text-gray-400 italic">
                    <svg
                        className="w-16 h-16 mx-auto text-gray-500 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    У пользователя пока нет фотографий
                </div>
            )}


            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-12 right-0 bg-transparent border-none text-white text-3xl cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                            onClick={closeModal}
                            aria-label="Закрыть"
                        >
                            ×
                        </button>

                        <img
                            src={selectedImage.path_image}
                            alt="Просмотр фото"
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />

                        <div className="flex items-center gap-5 mt-5">
                            <button
                                className=" bg-opacity-20 border-none text-white text-xl w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-colors hover:bg-opacity-30"
                                onClick={goToPrevImage}
                                aria-label="Предыдущее фото"
                            >
                                ‹
                            </button>

                            <div className="text-white text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded">
                                {currentIndex + 1} / {currentUserImages.length}
                            </div>

                            <button
                                className=" bg-opacity-20 border-none text-white text-xl w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-colors hover:bg-opacity-30"
                                onClick={goToNextImage}
                                aria-label="Следующее фото"
                            >
                                ›
                            </button>
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
};




export default UserImages;