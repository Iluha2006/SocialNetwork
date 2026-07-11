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

const ThemeChats = ({ onBack }) => {
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
        <div className="p-3">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <button
                    onClick={onBack}
                    className="bg-transparent border-none text-blue-400 text-sm cursor-pointer px-2 py-1 rounded hover:bg-white/10 transition-colors"
                >
                    ← Назад
                </button>
                <h3 className="text-gray-200 text-sm font-semibold m-0">Темы чата</h3>
            </div>

            <div className="themes-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div
                    className={`theme-option ${currentTheme === 'custom-background' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('custom-background')}
                >
                    <div
                        className="theme-preview"
                        style={{
                            background: selectedBackground ? `url(${selectedBackground}) center/cover` : '#333',
                            borderColor: '#007bff',
                            height: '60px'
                        }}
                    >
                        <div className="preview-message their" style={{ background: 'rgba(255,255,255,0.9)', color: '#333' }}>
                            Привет!
                        </div>
                        <div className="preview-message my" style={{ background: 'rgba(0,123,255,0.9)', color: 'white' }}>
                            Как дела?
                        </div>
                    </div>
                    <span className="theme-name" style={{ color: '#ccc' }}>
                        {selectedBackground ? 'Мой фон' : 'Свой фон'}
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
                            style=
                            {
                             {
                                background: theme.gradients.background,
                                borderColor: theme.colors.primary,
                                height: '60px'
                            }
                        }
                        >
                            <div className="preview-message their" style={{ background: theme.gradients.theirMessage, color: theme.colors.text }}>
                                Привет!
                            </div>
                          
                        </div>
                        <span className="theme-name" style={{ color: '#ccc' }}>{theme.name}</span>
                    </div>
                ))}
            </div>

            <div className="border-t border-white/10 pt-3">
                <h4 className="text-gray-300 text-xs font-medium mb-2">Загрузить свой фон</h4>
                <div className="flex items-center gap-2">
                    <ImageChat
                        forChatBackground={true}
                        onBackgroundSet={handleBackgroundSet}
                        currentBackground={selectedBackground}
                    />
                    {selectedBackground && (
                        <button
                            onClick={handleRemoveBackground}
                            className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs rounded-lg transition-colors border-none cursor-pointer"
                        >
                            Удалить
                        </button>
                    )}
                </div>

                {userBackgrounds && (
                    <div className="mt-3">
                        <h4 className="text-gray-300 text-xs font-medium mb-2">Мои фоны</h4>
                        <div className="backgrounds-grid" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {(Array.isArray(userBackgrounds) ? userBackgrounds : [userBackgrounds]).map((img, i) => (
                                <img key={i} src={img.path_image || img} className="w-14 h-14 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleBackgroundSet(img.path_image || img)} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThemeChats;
