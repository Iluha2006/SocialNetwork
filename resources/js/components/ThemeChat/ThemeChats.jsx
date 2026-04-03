import React, { useState, useEffect } from 'react';
import './ThemeChats.css';
import { useSelector, useDispatch } from 'react-redux';
import { chatThemes, getDefaultTheme, applyThemeToDocument } from './chatThemes';
import ImageChat from './ImageChat';
import {
    selectBackgroundByUserId,
    deleteBackground,
    selectAllBackgrounds,
    setSelectedBackground,
    clearSelectedBackground,
    selectSelectedBackgroundByChatId
} from '../../store/Files/BacroundImages';
import { useParams } from 'react-router-dom';

const ThemeChats = () => {
    const dispatch = useDispatch();
    const { userId } = useParams();
    const { user } = useSelector(state => state.user);
    const backgroundImage = useSelector(state => selectBackgroundByUserId(state, user?.id));
    const { backgrounds } = useSelector(state => state.background);


    const chatId = [user?.id, parseInt(userId)].sort().join('-');
    const selectedBackground = useSelector(state =>
        selectSelectedBackgroundByChatId(state, chatId)
    );

    const [currentTheme, setCurrentTheme] = useState(getDefaultTheme());
    const [showThemeSelector, setShowThemeSelector] = useState(false);


    const userBackgrounds = backgrounds && user?.id ? backgrounds[user.id] : null;


    useEffect(() => {
        const savedTheme = localStorage.getItem(`chatTheme_${chatId}`);


        if (savedTheme === 'custom-background' && selectedBackground) {
            setCurrentTheme('custom-background');

        }

        else if (savedTheme && savedTheme !== 'custom-background' && chatThemes[savedTheme]) {
            const theme = chatThemes[savedTheme];
            applyThemeToDocument(theme);
            setCurrentTheme(savedTheme);

            if (selectedBackground) {
                dispatch(clearSelectedBackground(chatId));
            }
        }

        else {
            const defaultThemeName = getDefaultTheme();
            const theme = chatThemes[defaultThemeName];
            applyThemeToDocument(theme);
            setCurrentTheme(defaultThemeName);
            localStorage.setItem(`chatTheme_${chatId}`, defaultThemeName);


            if (selectedBackground) {
                dispatch(clearSelectedBackground(chatId));
            }
        }
    }, [user?.id, userId, selectedBackground, dispatch, chatId]);




    const handleThemeChange = (themeName) => {


        if (themeName === 'custom-background') {
            if (selectedBackground) {
                setCurrentTheme('custom-background');
                dispatch(setSelectedBackground({ chatId, backgroundUrl: selectedBackground }));
                localStorage.setItem(`chatTheme_${chatId}`, 'custom-background');
            }
        } else {
            const theme = chatThemes[themeName] || chatThemes[getDefaultTheme()];
            if (theme) {
                applyThemeToDocument(theme);
                setCurrentTheme(themeName);
                dispatch(clearSelectedBackground(chatId));
                localStorage.setItem(`chatTheme_${chatId}`, themeName);
            }
        }
        setShowThemeSelector(false);
    };
    const handleBackgroundSet = (imageUrl) => {


        if (imageUrl) {
            setCurrentTheme('custom-background');
            dispatch(setSelectedBackground({ chatId, backgroundUrl: imageUrl }));
            localStorage.setItem(`chatTheme_${chatId}`, 'custom-background');
        } else {
            dispatch(clearSelectedBackground(chatId));
            setCurrentTheme(getDefaultTheme());
            localStorage.setItem(`chatTheme_${chatId}`, getDefaultTheme());
        }
    };
    const handleRemoveBackground = () => {

        dispatch(clearSelectedBackground(chatId));
        setCurrentTheme(getDefaultTheme());
        localStorage.setItem(`chatTheme_${chatId}`, getDefaultTheme());
    };


    return (
        <div className="theme-chats-container">
            <button
                className="theme-toggle-btn"
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                title="Сменить тему чата"
            >
                🎨
            </button>

            {showThemeSelector && (
                <div className="theme-selector-overlay" onClick={() => setShowThemeSelector(false)}>
                    <div className="theme-selector" onClick={(e) => e.stopPropagation()}>
                        <div className="theme-selector-header">
                            <h3>Выберите тему чата</h3>
                            <button
                                className="close-theme-selector"
                                onClick={() => setShowThemeSelector(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="themes-grid">
                            <div
                                className={`theme-option ${currentTheme === 'custom-background' ? 'active' : ''}`}
                                onClick={() => handleThemeChange('custom-background')}
                            >
                                <div
                                    className="theme-preview"
                                    style={{
                                        background: selectedBackground ? `url(${selectedBackground}) center/cover` : '#f0f0f0',
                                        borderColor: '#007bff'
                                    }}
                                >
                                    <div
                                        className="preview-message their"
                                        style={{
                                            background: 'rgba(255,255,255,0.9)',
                                            color: '#333'
                                        }}
                                    >
                                        Привет!
                                    </div>
                                    <div
                                        className="preview-message my"
                                        style={{
                                            background: 'rgba(0,123,255,0.9)',
                                            color: 'white'
                                        }}
                                    >
                                        Как дела?
                                    </div>
                                </div>
                                <span className="theme-name">
                                    {selectedBackground ? 'Мой фон' : 'Установить фон'}
                                </span>
                            </div>

                            {Object.entries(chatThemes).map(([key, theme]) => (
                                <div
                                    key={key}
                                    className={`theme-option ${currentTheme === key ? 'active' : ''}`}
                                    onClick={() => handleThemeChange(key)}
                                >
                                    <div
                                        className="theme-preview"
                                        style={{
                                            background: theme.gradients.background,
                                            borderColor: theme.colors.primary
                                        }}
                                    >
                                        <div
                                            className="preview-message their"
                                            style={{
                                                background: theme.gradients.theirMessage,
                                                color: theme.colors.text
                                            }}
                                        >
                                            Привет!
                                        </div>
                                        <div
                                            className="preview-message my"
                                            style={{
                                                background: theme.gradients.myMessage,
                                                color: theme.colors.myMessageText
                                            }}
                                        >
                                            Как дела?
                                        </div>
                                    </div>
                                    <span className="theme-name">{theme.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="theme-custom-section">
                            <div className="custom-theme-controls">
                                <div className="background-section">
                                    <h4>Загрузить новый фон</h4>
                                    <div className="background-controls">
                                        <ImageChat
                                            forChatBackground={true}
                                            onBackgroundSet={handleBackgroundSet}
                                            currentBackground={selectedBackground}
                                        />
                                    </div>

                                    {userBackgrounds && (
    <div className="existing-backgrounds">
        <h4>Мои фоны</h4>
        <div className="backgrounds-grid">
            {Array.isArray(userBackgrounds) ? (
                userBackgrounds.map((image) => (
                    <div>
                        <img
                            src={image.path_image}
                        />
                    </div>
                ))
            ) : (
                <div>
                    <img
                        src={userBackgrounds}
                    />
                </div>
            )}
        </div>
    </div>
)}

                                    {selectedBackground && (
                                        <div className="background-preview">
                                            <button
                                                onClick={handleRemoveBackground}
                                                className="remove-background-btn"
                                            >
                                                Удалить текущий фон
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeChats;
