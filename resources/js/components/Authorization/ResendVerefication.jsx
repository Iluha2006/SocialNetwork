
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { useResendVerificationMutation } from '../../api/authApi';

import SuccessNotification from './Notification/NotificationVerify';
import AuthErrorNotification from './Notification/AuthErrorNotification';

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(null);


  const [resendMutation, { isLoading }] = useResendVerificationMutation();

  const navigate = useNavigate();
  const location = useLocation();

  const stateEmail = location.state?.email ;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setNotification({ type: 'error', message: 'Введите email' });
      return;
    }

    try {
     
      await resendMutation(email).unwrap();

   
      setNotification({
        type: 'success',
        message: 'Письмо подтверждения отправлено. Проверьте почту.'
      });
      setEmail(''); 

    } catch (err) {
     
      const errorData = err.data;
      const status = err.status;

      let message = 'Ошибка отправки письма';

      if (status === 404) {
        message = errorData?.message || 'Пользователь с таким email не найден';
      } else if (status === 422) {
        message = errorData?.message || 'Email уже подтверждён. Вы можете войти.';
      } else {
        message = errorData?.message || err.message || message;
      }

      setNotification({ type: 'error', message });
      console.error('Resend failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#010e18] to-[#0a1929] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[rgba(1,14,24,0.946)] p-8 rounded-xl shadow-lg border border-gray-700">

     
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-white">
            Повторная отправка письма
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Введите email для получения новой ссылки подтверждения
          </p>
        </div>

      
        {notification?.type === 'success' && (
          <SuccessNotification message={notification.message} />
        )}

     
        {notification?.type === 'error' && (
          <AuthErrorNotification
            error={notification.message}
            className="border-red-700 bg-red-900/30 text-red-300"
          />
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email || stateEmail}
              onChange={(e) => {
                setEmail(e.target.value);
               
                if (notification) setNotification(null);
              }}
              placeholder="example@mail.com"
              disabled={isLoading}
              className="appearance-none relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors bg-white disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#010e18] transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Отправка...' : 'Отправить письмо'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors border border-gray-600"
            >
              Вернуться ко входу
            </button>
          </div>
        </form>

    
        <div className="text-center pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Вспомнили пароль?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              Войти в аккаунт
            </Link>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Нет аккаунта?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}