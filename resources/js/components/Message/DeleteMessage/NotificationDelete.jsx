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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className={`
        relative
        w-full
        max-w-sm
        sm:max-w-md
        bg-[rgba(1,14,24,0.946)]
        rounded-lg
        shadow-xl
        shadow-black/25
        ${isExiting ? 'animate-fadeOut scale-95' : 'animate-fadeIn scale-100'}
        transition-all
        duration-200
        border-l-4
        ${type === 'warning' ? 'border-[#ff9800]' : type === 'success' ? 'border-[#4caf50]' : 'border-[#f44336]'}
      `}>
        <div className="p-5 relative">

          <button
            className="
              absolute top-3 right-3
              bg-transparent border-none
              text-xl cursor-pointer
              w-7 h-7 flex items-center justify-center
              text-gray-400 hover:text-gray-200
              transition-colors duration-200
              rounded-full hover:bg-white/10
            "
            onClick={handleClose}
            aria-label="Закрыть уведомление"
          >
            ×
          </button>

          <div className="mb-5 pr-6">
            <span className="
              block text-sm sm:text-base
              text-amber-50 leading-relaxed font-medium
            ">
              {message}
            </span>
          </div>

          <div className="flex gap-2.5 justify-end flex-wrap">
            {showCancel && (
              <button
                className="
                  px-4 py-2.5
                  bg-gray-200 hover:bg-gray-300
                  text-gray-800 rounded-lg
                  text-sm font-medium
                  cursor-pointer transition-colors duration-200
                  border-none outline-none
                  focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
                  flex-1 sm:flex-none
                "
                onClick={handleClose}
                aria-label="Отмена"
              >
                Отмена
              </button>
            )}
            <button
              className="
                px-4 py-2.5
                bg-[#ff5252] hover:bg-[#ff1744]
                text-white rounded-lg
                text-sm font-medium
                cursor-pointer transition-colors duration-200
                border-none outline-none
                focus:ring-2 focus:ring-red-400 focus:ring-opacity-50
                flex-1 sm:flex-none
              "
              onClick={handleConfirm}
              aria-label="Подтвердить"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDelete;