import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePostButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="
        group
        relative
        flex
        items-center
        justify-center
        bg-[rgba(1,14,24,0.946)]
        hover:bg-[#0c305e]
        text-white
        border
        border-blue-500/20
        hover:border-blue-400/50
        rounded-2xl
        px-6
        py-3.5
        text-sm
        md:text-base
        font-medium
        cursor-pointer
        transition-all
        duration-300
        ease-in-out
        mx-auto
        my-2.5
        w-full
        max-w-[600px]
        shadow-[0_4px_20px_rgba(0,0,0,0.3)]
        hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)]
        active:scale-[0.97]
        active:shadow-[0_2px_10px_rgba(59,130,246,0.2)]
        overflow-hidden
      "
      onClick={() => navigate('/create-post')}
    >
      
      <span className="
        absolute
        inset-0
        bg-linear-to-r
        from-blue-500/0
        via-blue-500/10
        to-blue-500/0
        -translate-x-full
        group-hover:translate-x-full
        transition-transform
        duration-700
        ease-in-out
      "></span>

     
      <span className="
        absolute
        -top-1
        -right-1
        w-3
        h-3
        bg-blue-500
        rounded-full
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-300
        animate-pulse
        shadow-[0_0_20px_rgba(59,130,246,0.5)]
      "></span>

      <span className="
        relative
        flex
        items-center
        justify-center
        gap-3
        z-10
      ">
  
        <span className="
          flex
          items-center
          justify-center
          w-8
          h-8
          bg-blue-500/20
          group-hover:bg-blue-500/30
          rounded-full
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:rotate-90
        ">
          <span className="
            text-xl
            md:text-2xl
            font-bold
            leading-none
            text-blue-400
            group-hover:text-blue-300
            transition-colors
            duration-300
          ">
            +
          </span>
        </span>

        <span className="
          relative
          font-semibold
          tracking-wide
          group-hover:tracking-wider
          transition-all
          duration-300
        ">
          Создать пост
        </span>

    
        <span className="
          opacity-0
          group-hover:opacity-100
          -translate-x-2.5
          group-hover:translate-x-0
          transition-all
          duration-300
          text-blue-400
        ">
          →
        </span>
      </span>
    </button>
  );
};

export default CreatePostButton;