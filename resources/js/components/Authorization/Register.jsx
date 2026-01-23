import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/UserStore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await dispatch(register(formData));
      navigate('/home');
    }
    catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({
          general: err.response?.data?.message || err.message || 'Произошла ошибка'
        });
      }
      console.error('Registration failed:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const renderError = (error) => {
    if (Array.isArray(error)) {
      return error.join(', ');
    }
    return error;
  };

  return (
    <div className=" m-7 w-96 sm:w-full max-w-md mx-auto my-8 p-8 bg-[rgba(1,14,24,0.946)] border border-gray-700 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white text-center font-semibold mb-6">Регистрация</h2>

      {errors.general && (
        <div className="text-red-500 text-sm mb-4 p-3 bg-red-100 rounded-lg">
          {renderError(errors.general)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="space-y-2">
          <label className="block text-white font-medium">Имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
          />
          {errors.name && (
            <div className="text-red-500 text-sm">
              {renderError(errors.name)}
            </div>
          )}
        </div>


        <div className="space-y-2">
          <label className="block text-white font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
          />
          {errors.email && (
            <div className="text-red-500 text-sm">
              {renderError(errors.email)}
            </div>
          )}
        </div>


        <div className="space-y-2">
          <label className="block text-white font-medium">Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
          />
          {errors.password && (
            <div className="text-red-500 text-sm">
              {renderError(errors.password)}
            </div>
          )}
        </div>


        <div className="space-y-2">
          <label className="block text-white font-medium">Подтверждение пароля:</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
          />
          {errors.password_confirmation && (
            <div className="text-red-500 text-sm">
              {renderError(errors.password_confirmation)}
            </div>
          )}
        </div>


        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Обработка...' : 'Зарегистрироваться'}
        </button>
      </form>

      <p className="text-white text-center mt-6">
        Уже есть аккаунт?{' '}
        <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
          Войти
        </a>
      </p>
    </div>
  );
};

export default Register;