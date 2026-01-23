import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePostButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="
        flex
        items-center
        justify-center
        bg-[rgba(1,14,24,0.946)]
        hover:bg-[#0c305e]
        text-white
        border-none
        rounded
        px-4
        py-2.5
        text-sm
        md:text-base
        font-medium
        cursor-pointer
        transition-colors
        duration-200
        ease-in-out
        mx-auto
        my-2.5
        w-full
        max-w-[400px]
        shadow-md
        hover:shadow-lg
        active:scale-[0.98]
        active:shadow-md
      "
      onClick={() => navigate('/create-post')}
    >
      <span className="
        text-lg
        md:text-xl
        font-bold
        mr-2
        leading-none
      ">
        +
      </span>
      <span>
        Создать пост
      </span>
    </button>
  );
};

export default CreatePostButton;