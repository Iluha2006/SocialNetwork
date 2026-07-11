import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAppTheme, setTextGradient } from '../../../store/Theme/themeSlice';
import { appThemes, textGradients } from '../../../store/Theme/appThemes';

const AppearanceSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const currentTheme = useSelector(state => state.theme.appThemeName);
  const currentGradient = useSelector(state => state.theme.textGradient);

  const handleThemeSelect = (themeName) => {
    dispatch(setAppTheme({ userId: user?.id, themeName }));
  };

  const handleGradientSelect = (gradientKey) => {
    dispatch(setTextGradient({ userId: user?.id, gradientKey }));
  };

  return (
    <div className="w-full max-w-96 md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl min-h-screen my-4 md:my-8"
      style={{ background: 'var(--card-bg-secondary, rgba(1, 14, 24, 0.946))' }}
    >
      <button
        className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200 flex items-center gap-2 hover:gap-3 active:scale-95"
        style={{ color: 'var(--text-color, #ffffff)' }}
        onClick={() => navigate(-1)}
      >
        ← Назад
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-light mb-3 tracking-tight"
          style={{ color: 'var(--text-color, #ffffff)' }}
        >
          Оформление
        </h1>
        <p className="text-base md:text-lg max-w-md mx-auto"
          style={{ color: 'var(--text-secondary, #a8a8a8)' }}
        >
          Цветовая тема интерфейса и градиент для текста
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-medium mb-4"
          style={{ color: 'var(--text-color, #ffffff)' }}
        >
          Тема интерфейса
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {Object.entries(appThemes).map(([key, theme]) => {
            const isActive = currentTheme === key;
            const previewBg = theme.colors['--bg-color'] || theme.colors['--card-bg'];
            const previewAccent = theme.colors['--primary-color'];
            const previewText = theme.colors['--text-color'];

            return (
              <button
                key={key}
                onClick={() => handleThemeSelect(key)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  hover:scale-[1.02] active:scale-[0.98]
                  ${isActive ? 'border-white/40 shadow-lg' : 'border-white/10 hover:border-white/20'}
                `}
                style={{
                  background: previewBg,
                  color: previewText,
                }}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/>
                    </svg>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full" style={{ background: previewAccent }} />
                    <span className="font-medium text-sm">{theme.name}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <div className="w-4 h-4 rounded-sm opacity-80" style={{ background: previewAccent }} />
                    <div className="w-4 h-4 rounded-sm opacity-60" style={{ background: previewAccent }} />
                    <div className="w-4 h-4 rounded-sm opacity-40" style={{ background: previewAccent }} />
                  </div>

                  <div className="h-1.5 rounded-full w-full opacity-30" style={{ background: previewAccent }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/10 pt-8">
        <h2 className="text-xl font-medium mb-4"
          style={{ color: 'var(--text-color, #ffffff)' }}
        >
          Градиент для текста
        </h2>
        <p className="text-sm mb-5"
          style={{ color: 'var(--text-secondary, #a8a8a8)' }}
        >
          Выберите градиентную заливку для текста во всём приложении
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {Object.entries(textGradients).map(([key, grad]) => {
            const isActive = currentGradient === key;

            return (
              <button
                key={key}
                onClick={() => handleGradientSelect(key)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                  hover:scale-[1.02] active:scale-[0.98]
                  ${isActive ? 'border-white/40 shadow-lg' : 'border-white/10 hover:border-white/20'}
                `}
                style={{ background: 'var(--card-bg, #041527)' }}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="white">
                      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/>
                    </svg>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div
                    className="text-sm font-semibold"
                    style={{
                      background: grad.value || 'var(--text-color)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: grad.value ? 'transparent' : 'var(--text-color)',
                      backgroundClip: 'text',
                    }}
                  >
                    {grad.name}
                  </div>
                  {grad.value && (
                    <div className="h-2 rounded-full" style={{ background: grad.value }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs opacity-50" style={{ color: 'var(--text-secondary, #a8a8a8)' }}>
          Настройки применяются сразу и сохраняются для вашего аккаунта
        </p>
      </div>
    </div>
  );
};

export default AppearanceSettings;
