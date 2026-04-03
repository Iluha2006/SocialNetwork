
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorOauth() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgba(1,14,24,0.98)] to-[rgba(20,40,70,0.95)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden">


          <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>

          <div className="p-8 text-center">


            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-gradient-to-br from-red-500 to-orange-500 rounded-full w-24 h-24 flex items-center justify-center shadow-lg shadow-red-500/30">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              Что-то пошло не так
            </h1>

            <p className="text-gray-300 mb-6">
              Не удалось завершить авторизацию через Яндекс.
              Пожалуйста, попробуйте снова или используйте другой способ входа.
            </p>
            <div className="space-y-3">


              <button
                onClick={() => navigate('/login')}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 border border-white/10"
              >
                Вернуться к входу
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}