
import { useState } from 'react';
import { useRegisterMutation } from '../api/authApi';

export const useRegister = () => {
  const [registerMutation,  { isLoading }] = useRegisterMutation();
  const [errors, setErrors] = useState({});

  const register = async (formData) => {
    setErrors({});

    try {
      const response = await registerMutation(formData).unwrap();
      console.log('Register mutation response:', response);


      return {
        success: true,
        data: response.data,
        response: response,
        message: response?.message,
      };

    } catch (err) {
      console.error('Register error:', err);
      const errorData = err.data;
      const status = err.status;

      if (status === 422) {
        setErrors({ validation: errorData?.errors || {} });
      } else if (status === 409) {
        setErrors({
          general: {
            message: errorData?.message || 'Пользователь с таким email уже зарегистрирован'
          }
        });
      } else {
        setErrors({
          general: {
            message: errorData?.message || err.message || 'Произошла ошибка при регистрации'
          }
        });
      }

      return {
        success: false,
        error: errorData,
        status: status,
        message: errorData?.message || 'Ошибка регистрации',
      };
    }
  };

  const clearErrors = () => setErrors({});

  return {
    register,
    isLoading,
    errors,
    clearErrors,
  };
};