import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLoginMutation } from '../../api/authApi';

import AuthErrorNotification from './Notification/AuthErrorNotification';
import { useYandexCallbackMutation } from '../../api/OauthApi';
import LoginYandex from './SocialiteAuth/loginYandex';

 const  Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');
  const [loginMutation, {isLoading} ] = useLoginMutation();
  const [yandexCallback] = useYandexCallbackMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const result = await loginMutation({ email, password });

           console.log("Данные после входа", result)


        navigate('/home', { replace: true });
    } catch (err) {
        console.error('Login failed:', err);
    }
};

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password || errors.general?.message) {
      setErrors({});
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email || errors.general?.message) {
      setErrors({});
    }
  };

  const renderError = () => {
    if (errors.general?.type === 'email_not_verified') {
      return (
        <AuthErrorNotification
          error={errors.general.message}
          email={errors.general.email}
          resendLinkText="Отправить письмо подтверждения"
          resendPath="/resend-verification"
          verificationKeyword="подтвердите"
        />
      );
    }
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
      <h2 className="text-2xl text-white text-center font-semibold mb-6">Вход</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-white font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-white font-medium">Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
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
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <p className="text-white text-center mt-6">
        Нет аккаунта?{' '}
        <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">
          Зарегистрироваться
        </Link>
      </p>


      <div className="flex justify-center">
       <LoginYandex/>
      </div>
    </div>
  );
};

export default Login;