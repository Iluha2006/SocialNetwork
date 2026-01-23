import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserImages, deleteUserImage } from '../../../store/ImagesStore';


const UserPhotos = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
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
      console.error('Ошибка удаления:', result.error);
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

  if (imagesLoading) {
    return <div className="loading">Загрузка фотографий...</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6  rounded-2xl shadow-lg"  style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-3xl font-bold text-white">Мои фотографии</h1>

    <button
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      onClick={() => navigate('/imageprofile')}
    >
      <span className="create-images">Загрузить фото</span>
    </button>
  </div>

  {images.length === 0 ? (
    <div className="text-center py-16 bg-gray-800 rounded-xl">
      <p className="text-xl text-gray-300">У вас пока нет фотографий</p>
    </div>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="relative rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer group"
          onClick={() => openModal(image, index)}
        >
          <div className="relative">
            <img
              src={image.path_image}
              alt={`Фото ${index + 1}`}
              className=" h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/200x200?text=Ошибка+загрузки';
              }}
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              onClick={(e) => handleDelete(image.id, e)}
              fill="currentColor"
              viewBox="0 0 16 16"
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
          </div>
        </div>
      ))}
    </div>
  )}

  {selectedImage && (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="relative max-w-4xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={selectedImage.path_image}
          alt="Просмотр фото"
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        <button
          className="absolute -top-12 right-0  bg-opacity-20 text-white text-3xl w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          onClick={closeModal}
        >
          ×
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  )}
</div>
  );
};

export default UserPhotos;
