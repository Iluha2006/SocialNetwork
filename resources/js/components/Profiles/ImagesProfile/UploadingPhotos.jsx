import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateImagePhoto.css';

const CreateImagePhoto = () => {
  const navigate = useNavigate();

  return (
    <button
      className="but-images"
      onClick={() => navigate('/imageprofile')}
    >
      <span className="create-images">Загрузить фото </span>
    </button>
  );
};

export default CreateImagePhoto;