import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/UserStore';
import { fetchProfile } from '../../store/Profile';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await dispatch(login({ email, password }));
      navigate('/home');
    } catch (err) {

      if (err.response?.status === 422) {

        setErrors(err.response.data.errors || {});
      } else if (err.response?.status === 401) {

        setErrors({
          general: err.response?.data?.message || 'Неверный email или пароль'
        });
      } else {
        setErrors({
          general: err.response?.data?.message || err.message || 'Произошла ошибка при входе'
        });
      }
      console.error('Login failed:', err);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: null });
    }
    if (errors.general) {
      setErrors({ ...errors, general: null });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: null });
    }
    if (errors.general) {
      setErrors({ ...errors, general: null });
    }
  };


  const renderError = (error) => {
    if (Array.isArray(error)) {
      return error.join(', ');
    }
    return error;
  };

  return (
    <div className="m-7 w-96  sm:w-full max-w-md mx-auto my-8 p-8 bg-[rgba(1,14,24,0.946)] border border-gray-700 rounded-lg shadow-lg">
      <h2 className="text-2xl text-white text-center font-semibold mb-6">Вход</h2>

      {errors.general && (
        <div className="text-red-500 text-sm mb-4 p-3 bg-red-100 rounded-lg">
          {renderError(errors.general)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-white font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
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
            value={password}
            onChange={handlePasswordChange}
            required
            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-colors"
          />
          {errors.password && (
            <div className="text-red-500 text-sm">
              {renderError(errors.password)}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <p className="text-white text-center mt-6">
        Нет аккаунта?{' '}
        <a  href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
          Зарегистрироваться
        </a>
      </p>
    </div>
  );
};

export default Login;