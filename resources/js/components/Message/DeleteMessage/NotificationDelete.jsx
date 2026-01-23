import React, { useEffect, useState } from 'react';

const NotificationDelete = (props) => {
  const {
    message,
    type = 'warning',
    onClose,
    onConfirm,
    duration = 0,
    showCancel = true
  } = props;

  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  const handleConfirm = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onConfirm) onConfirm();
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const typeStyles = {
    warning: 'border-l-4 border-[#ff9800]',
    success: 'border-l-4 border-[#4caf50]',
    error: 'border-l-4 border-[#f44336]'
  };

  return (
    <div className={`
      fixed
      top-5
      right-1
      bg-white
      rounded-lg
      shadow-lg
      shadow-black/15
      z-1000
      max-w-[400px]
      min-w-[300px]
      ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}
      sm:max-w-md
      sm:min-w-[320px]
    `}>

      <div className="bg-[rgba(1,14,24,0.946)] rounded-lg">
        <div className={`
          rounded-r-lg
          ${typeStyles[type]}
        `}>
          <div className="p-4 relative">

            <div className="mb-4 pr-8">
              <span className="
                block
                text-sm
                text-amber-50
                leading-relaxed
                font-medium
              ">
                {message}
              </span>
            </div>


            <div className="
              flex
              gap-2
              justify-end
              flex-wrap
            ">
              {showCancel && (
                <button
                  className="
                    px-4
                    py-2
                    bg-gray-200
                    hover:bg-gray-300
                    text-gray-800
                    rounded
                    text-sm
                    font-medium
                    cursor-pointer
                    transition-colors
                    duration-200
                    min-w-80
                    border-none
                    outline-none
                    focus:ring-2
                    focus:ring-gray-400
                    focus:ring-opacity-50
                  "
                  onClick={handleClose}
                  aria-label="Отмена"
                >
                  Отмена
                </button>
              )}
              <button
                className="
                  px-4
                  py-2
  bg-[#ff5252]
                  hover:bg-[#ff1744]
                  text-white
                  rounded
                  text-sm
                  font-medium
                  cursor-pointer
                  transition-colors
                  duration-200
                  min-w-80
                  border-none
                  outline-none
                  focus:ring-2
   focus:ring-red-400
                  focus:ring-opacity-50
                  z-1001
                  relative
                "
                onClick={handleConfirm}
                aria-label="Подтвердить"
              >
                Удалить
              </button>
            </div>


            <button
              className="
                absolute
                top-3
                right-3
                bg-transparent
                border-none
                text-xl
                cursor-pointer
                p-0
                w-6
                h-6
                flex
                items-center
                justify-center
                text-gray-500
                hover:text-gray-800
                transition-colors
                duration-200
                rounded-full
                hover:bg-gray-100
              "
              onClick={handleClose}
              aria-label="Закрыть уведомление"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDelete;