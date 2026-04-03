
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPrivacySettings,
  updatePrivacySettings,
  clearError
} from '../../../store/settings/PrivateProfile';

const PrivateProfileSettings = () => {
  const dispatch = useDispatch();
  const { privacySettings, loading, error } = useSelector((state) => state.privateProfile);

  const [settings, setSettings] = useState({
    profile_visibility: 'public',
    friends_visible: true,
    images_visible: true,
  });

  const [saveStatus, setSaveStatus] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      await dispatch(fetchPrivacySettings());
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  };

  useEffect(() => {
    if (privacySettings) {
      setSettings(privacySettings);
      setIsChanged(false);
    }
  }, [privacySettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setSettings(prev => ({
      ...prev,
      [name]: newValue
    }));
    setIsChanged(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('Сохранение...');

    try {
      await dispatch(updatePrivacySettings(settings));
      setSaveStatus('Настройки сохранены успешно!');
      setIsChanged(false);

      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Ошибка сохранения настроек');
    }
  };

  const handleReset = () => {
    if (privacySettings) {
      setSettings(privacySettings);
      setIsChanged(false);
    }
  };

  const getVisibilityDescription = (value) => {
    const descriptions = {
      public: 'Ваш профиль могут видеть все пользователи',
      friends: 'Ваш профиль видят только ваши друзья',
      private: 'Ваш профиль скрыт от всех'
    };
    return descriptions[value] || '';
  };

  if (loading && !privacySettings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-white">Загрузка настроек приватности...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {(!loading || privacySettings) && (
        <div className="bg-[rgba(1,14,24,0.946)] rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">

          <div className="px-6 py-8 border-b border-gray-700/50 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-900/30 rounded-xl backdrop-blur-sm">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Настройки приватности профиля</h2>
                <p className="text-gray-300 mt-1">Управляйте, кто может видеть вашу информацию и взаимодействовать с вами</p>
              </div>
            </div>
          </div>


          <div className="px-6 pt-6">
            {error && (
              <div className="mb-6 bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-300">{error}</p>
                  </div>
                  <button
                    onClick={() => dispatch(clearError())}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {saveStatus && (
              <div className={`mb-6 rounded-lg p-4 ${saveStatus.includes('Ошибка')
                ? 'bg-red-900/20 border border-red-700/50 text-red-300'
                : 'bg-green-900/20 border border-green-700/50 text-green-300'}`}>
                <div className="flex items-center">
                  {saveStatus.includes('Ошибка') ? (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{saveStatus}</span>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="px-6 pb-8">

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-900/30 rounded-xl backdrop-blur-sm mr-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Видимость профиля</h3>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <label className="block mb-3 text-sm font-medium text-gray-300">
                  Кто может видеть мой профиль:
                </label>
                <select
                  name="profile_visibility"
                  value={settings.profile_visibility}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/70 border border-gray-600 rounded-lg
                           text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500
                           focus:border-blue-500 transition-colors"
                >
                  <option value="public" className="bg-gray-800 text-white">Все пользователи</option>
                  <option value="friends" className="bg-gray-800 text-white">Только друзья</option>
                  <option value="private" className="bg-gray-800 text-white">Только я</option>
                </select>
                <p className="mt-3 text-sm text-gray-300 bg-blue-900/20 px-4 py-3 rounded-lg">
                  <svg className="w-4 h-4 inline mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {getVisibilityDescription(settings.profile_visibility)}
                </p>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-900/30 rounded-xl backdrop-blur-sm mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-green-400" viewBox="0 0 16 16">
                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Друзья</h3>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <label className="flex items-start cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="friends_visible"
                      checked={settings.friends_visible}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${settings.friends_visible ? 'bg-green-600' : 'bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.friends_visible ? 'left-6' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="block font-medium text-white">Показывать список моих друзей</span>
                    <span className="block text-sm text-gray-300 mt-1">
                      Другие пользователи могут видеть, кто у вас в друзьях
                    </span>
                  </div>
                </label>
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-900/30 rounded-xl backdrop-blur-sm mr-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Изображения</h3>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
                <label className="flex items-start cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="images_visible"
                      checked={settings.images_visible}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${settings.images_visible ? 'bg-purple-600' : 'bg-gray-600'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings.images_visible ? 'left-6' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="block font-medium text-white">Показывать мои изображения</span>
                    <span className="block text-sm text-gray-300 mt-1">
                      Другие пользователи могут просматривать ваши фотографии
                    </span>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
              <button
                type="button"
                onClick={handleReset}
                disabled={!isChanged || loading}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  !isChanged || loading
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Отменить изменения
              </button>
              <button
                type="submit"
                disabled={loading || !isChanged}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  loading || !isChanged
                    ? 'bg-blue-700/50 text-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Сохранение...
                  </span>
                ) : (
                  'Сохранить настройки'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PrivateProfileSettings;