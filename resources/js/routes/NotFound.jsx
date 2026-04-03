import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgba(1,14,24,0.946)] text-white">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-amber-50 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-amber-50 mb-6">
          Страница не найдена
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white font-medium"
          >
            ← Назад
          </button>

          <Link
            to="/home"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors text-white font-medium"
          >
             На главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;