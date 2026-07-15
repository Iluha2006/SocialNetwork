import React, { useEffect, useMemo } from 'react';
import './ThemeChats.css';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chatThemes, DEFAULT_CHAT_THEME, applyChatTheme } from './chatThemes';
import { initChatTheme, setChatTheme, selectChatTheme } from '../../store/Theme/chatThemeSlice';
import ImageChat from './ImageChat';
import {
    selectBackgroundByUserId,
    selectAllBackgrounds,
    setSelectedBackground,
    clearSelectedBackground,
    selectSelectedBackgroundByChatId
} from '../../store/Files/BacroundImages';

const ThemeChats = ({ onBack }) => {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const { user } = useSelector(state => state.user);
    const backgroundImage = useSelector(state => selectBackgroundByUserId(state, user?.id));
    const { backgrounds } = useSelector(state => state.background);

    const chatId = useMemo(() => [user?.id, parseInt(userId)].sort().join('-'), [user?.id, userId]);

    const selectedBackground = useSelector(state =>
        selectSelectedBackgroundByChatId(state, chatId)
    );

    const currentTheme = useSelector(state => selectChatTheme(state, chatId));

    const userBackgrounds = backgrounds && user?.id ? backgrounds[user.id] : null;

    useEffect(() => {
        if (chatId) {
            dispatch(initChatTheme({ chatId }));
        }
    }, [chatId, dispatch]);

    useEffect(() => {
        if (currentTheme === 'custom-background' && selectedBackground) {
            const root = document.documentElement;
            root.style.setProperty('--chat-background-gradient', `url(${selectedBackground})`);
        } else if (chatThemes[currentTheme]) {
            applyChatTheme(currentTheme);
        }
    }, [currentTheme, selectedBackground]);

    const handleThemeSelect = (themeName) => {
        if (themeName === 'custom-background') {
            if (selectedBackground) {
                dispatch(setChatTheme({ chatId, themeName: 'custom-background' }));
                dispatch(setSelectedBackground({ chatId, backgroundUrl: selectedBackground }));
            }
        } else {
            dispatch(setChatTheme({ chatId, themeName }));
            dispatch(clearSelectedBackground(chatId));
        }
    };

    const handleBackgroundSet = (imageUrl) => {
        if (imageUrl) {
            dispatch(setChatTheme({ chatId, themeName: 'custom-background' }));
            dispatch(setSelectedBackground({ chatId, backgroundUrl: imageUrl }));
        } else {
            dispatch(clearSelectedBackground(chatId));
            dispatch(setChatTheme({ chatId, themeName: DEFAULT_CHAT_THEME }));
        }
    };

    const handleRemoveBackground = () => {
        dispatch(clearSelectedBackground(chatId));
        dispatch(setChatTheme({ chatId, themeName: DEFAULT_CHAT_THEME }));
    };

    const isActive = (key) => currentTheme === key;

    return (
        <div className="p-2.5 max-h-[70vh] flex flex-col">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10 shrink-0">
                <button
                    onClick={onBack}
                    className="bg-transparent border-none text-blue-400 text-sm cursor-pointer px-2 py-1 rounded hover:bg-white/10 transition-colors"
                >
                    ← Назад
                </button>
                <h3 className="text-gray-200 text-sm font-semibold m-0">Темы чата</h3>
            </div>

            <div className="overflow-y-auto flex-1 min-h-0 pr-1">
                <div className="chat-theme-grid">
                    <button
                        onClick={() => handleThemeSelect('custom-background')}
                        className={`
                            relative p-2 rounded-lg border-2 transition-all duration-200
                            hover:scale-[1.02] active:scale-[0.98]
                            ${isActive('custom-background') ? 'border-blue-400 shadow-lg' : 'border-white/10 hover:border-white/20'}
                        `}
                        style={{ background: 'var(--card-bg, #041527)' }}
                    >
                        {isActive('custom-background') && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="white">
                                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/>
                                </svg>
                            </div>
                        )}
                        <div
                            className="w-full h-12 rounded-md mb-2 flex items-center justify-center overflow-hidden"
                            style={{
                                background: selectedBackground
                                    ? `url(${selectedBackground}) center/cover`
                                    : 'linear-gradient(135deg, #333 0%, #555 100%)'
                            }}
                        >
                            <div className="flex flex-col gap-0.5 p-1.5 w-full">
                                <div className="px-1.5 py-0.5 rounded text-[8px] max-w-[60%] self-start"
                                    style={{ background: 'rgba(255,255,255,0.85)', color: '#333' }}>
                                    Привет!
                                </div>
                                <div className="px-1.5 py-0.5 rounded text-[8px] max-w-[60%] self-end"
                                    style={{ background: 'rgba(0,123,255,0.9)', color: 'white' }}>
                                    Как дела?
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary, #a8a8a8)' }}>
                            {selectedBackground ? 'Мой фон' : 'Свой фон'}
                        </span>
                    </button>

                    {Object.entries(chatThemes).map(([key, theme]) => {
                        const active = isActive(key);
                        const bg = theme.colors['--chat-background-gradient'];
                        const myMsg = theme.colors['--chat-my-message-gradient'];
                        const theirMsg = theme.colors['--chat-their-message-gradient'];
                        const primary = theme.colors['--chat-primary'];
                        const text = theme.colors['--chat-text'];

                        return (
                            <button
                                key={key}
                                onClick={() => handleThemeSelect(key)}
                                className={`
                                    relative p-2 rounded-lg border-2 transition-all duration-200
                                    hover:scale-[1.02] active:scale-[0.98]
                                    ${active ? 'border-white/40 shadow-lg' : 'border-white/10 hover:border-white/20'}
                                `}
                                style={{ background: 'var(--card-bg, #041527)' }}
                            >
                                {active && (
                                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="white">
                                            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/>
                                        </svg>
                                    </div>
                                )}

                                <div
                                    className="w-full h-12 rounded-md mb-2 flex flex-col justify-end p-1.5 gap-0.5 overflow-hidden"
                                    style={{ background: bg }}
                                >
                                    <div
                                        className="px-1.5 py-0.5 rounded text-[8px] max-w-[60%] self-start"
                                        style={{ background: theirMsg, color: text }}
                                    >
                                        Привет!
                                    </div>
                                    <div
                                        className="px-1.5 py-0.5 rounded text-[8px] max-w-[60%] self-end"
                                        style={{ background: myMsg, color: theme.colors['--chat-my-message-text'] }}
                                    >
                                        Как дела?
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-1 items-center">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: primary }} />
                                        <span className="text-[10px] font-medium truncate" style={{ color: 'var(--text-color, #ffffff)' }}>
                                            {theme.name}
                                        </span>
                                    </div>
                                    <div className="h-1 rounded-full w-full" style={{ background: myMsg }} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="border-t border-white/10 pt-2.5 mt-2.5 shrink-0">
                <h4 className="text-gray-300 text-[10px] font-medium mb-1.5">Загрузить свой фон</h4>
                <div className="flex items-center gap-2">
                    <ImageChat
                        forChatBackground={true}
                        onBackgroundSet={handleBackgroundSet}
                        currentBackground={selectedBackground}
                    />
                    {selectedBackground && (
                        <button
                            onClick={handleRemoveBackground}
                            className="px-2.5 py-1 bg-red-600/80 hover:bg-red-600 text-white text-[10px] rounded-lg transition-colors border-none cursor-pointer"
                        >
                            Удалить
                        </button>
                    )}
                </div>

                {userBackgrounds && (
                    <div className="mt-2">
                        <h4 className="text-gray-300 text-[10px] font-medium mb-1.5">Мои фоны</h4>
                        <div className="flex gap-1.5 flex-wrap">
                            {(Array.isArray(userBackgrounds) ? userBackgrounds : [userBackgrounds]).map((img, i) => (
                                <img
                                    key={i}
                                    src={img.path_image || img}
                                    className="w-10 h-10 rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => handleBackgroundSet(img.path_image || img)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThemeChats;
