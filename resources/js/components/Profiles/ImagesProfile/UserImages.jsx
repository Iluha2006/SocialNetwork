import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchUserImages, deleteUserImage } from '../../../store/Files/ImagesStore';

const UserImages = ({userId: users}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.user);
  const { userImages, imagesLoading } = useSelector(state => state.images);

  const userId = user?.id;
  const images = userImages && userImages[userId] ? userImages[userId] : [];

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserImages(userId));
    }
  }, [userId, dispatch]);

  const handleDelete = async (imageId, e) => {
    e.stopPropagation();

    if (!window.confirm('Вы уверены, что хотите удалить это изображение?')) {
      return;
    }

    const result = await dispatch(deleteUserImage(imageId, userId));

    if (result.success) {
      if (selectedImage && selectedImage.id === imageId) {
        setSelectedImage(null);
      }
    } else {
      setError(result.error || 'Ошибка удаления изображения');
    }
  };

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
  };

  const goToPrev = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  if (imagesLoading && images.length === 0) {
    return <div className="loading">Загрузка изображений...</div>;
  }
  return (
     <div className="px-6 py-3  text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>

      <h1 className="text-2xl font-semibold text-white mb-5 text-shadow-lg">Мои фотографии</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5 rounded flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="bg-opacity-20 text-white px-4 py-2 rounded-lg cursor-pointer text-sm hover:bg-opacity-30 transition-all"
          >
            ОК
          </button>
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>У вас пока нет фотографий</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative rounded-xl shadow-lg transition-all duration-300 cursor-pointer bg-white/5 border border-white/10 hover:shadow-xl group"
              onClick={() => openModal(image, index)}
            >
              <img
                src={image.path_image}
                alt={`Фото ${index + 1}`}
                className="min-w-5/12 h-48 object-cover rounded-xl transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x200?text=Ошибка+загрузки';
                }}
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                onClick={(e) => handleDelete(image.id, e)}
                height="24"
                fill="currentColor"
                viewBox="0 0 16 16"
                className="absolute top-2 right-2 bg-red-600 rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-red-700 active:scale-95"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-5 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.path_image}
              alt="Просмотр фото"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Ошибка+загрузки';
              }}
            />

            <button
              className="absolute left-5 top-1/2 -translate-y-1/2  bg-opacity-15 text-white rounded-full w-12 h-12 text-2xl cursor-pointer flex items-center justify-center transition-all hover:bg-opacity-25 active:scale-95 border border-white/20"
              onClick={goToPrev}
            >
              ‹
            </button>

            <button
              className="absolute right-5 top-1/2 -translate-y-1/2  bg-opacity-15 text-white rounded-full w-12 h-12 text-2xl cursor-pointer flex items-center justify-center transition-all hover:bg-opacity-25 active:scale-95 border border-white/20"
              onClick={goToNext}
            >
              ›
            </button>

            <button
 className="absolute -top-12 right-0 text-white rounded-full w-11 h-11 text-xl cursor-pointer flex items-center justify-center transition-all hover:bg-opacity-25 active:scale-95 border border-white/20"
              onClick={closeModal}
            >
              ×
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white bg-black bg-opacity-70 px-5 py-2 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserImages;