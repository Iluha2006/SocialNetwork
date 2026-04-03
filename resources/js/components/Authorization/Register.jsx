
import { clearAuth } from '../../store/Auth/UserStore';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useRegister';
import profileApi from '../../api/modules/profileApi';


import { useDispatch } from 'react-redux';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, isLoading, errors, clearErrors } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    dispatch(clearAuth());

    const result = await register(formData);
    console.log('Registration result:', result);


    if (result.success) {


        setTimeout(() => {
            dispatch(profileApi.endpoints.getProfile.initiate(result.data.user.id));
        }, 500);
      navigate('/home', { replace: true });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors.validation?.[name] || errors.general?.message) {
      clearErrors();
    }
  };

  const renderError = () => {
    if (errors.general?.message) {
      return (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
          {errors.general.message}
        </div>
      );
    }
    if (errors.validation) {
      return Object.entries(errors.validation).map(([field, messages]) => (
        <div key={field} className="mb-2 text-red-500 text-sm">
          {Array.isArray(messages) ? messages.join(', ') : messages}
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="m-7 w-96 sm:w-full max-w-md mx-auto my-8 p-8 bg-[rgba(1,14,24,0.946)] border border-gray-700 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white text-center font-semibold mb-6">Регистрация</h2>


      {renderError()}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-white font-medium">Имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-white font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-white font-medium">Пароль:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-white font-medium">Подтверждение пароля:</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Обработка...' : 'Зарегистрироваться'}
        </button>
      </form>

      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">или</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>


      <p className="text-white text-center mt-6">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
          Войти
        </Link>
      </p>
    </div>
  );
};

export default Register;