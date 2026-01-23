export const chatThemes = {
    default: {
        name: 'По умолчанию',
        gradients: {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            myMessage: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
            theirMessage: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            header: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)'
        },
        colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            background: '#ffffff',
            messageBg: '#f8f9fa',
            myMessageBg: '#007bff',
            text: '#212529',
            myMessageText: '#ffffff',
            border: '#dee2e6'
        }
    },
    dark: {
        name: 'Тёмная',
        gradients: {
            background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
            myMessage: 'linear-gradient(135deg, #bb86fc 0%, #9b59b6 100%)',
            theirMessage: 'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)',
            header: 'linear-gradient(135deg, #bb86fc 0%, #9b59b6 100%)'
        },
        colors: {
            primary: '#bb86fc',
            secondary: '#03dac6',
            background: '#121212',
            messageBg: '#1e1e1e',
            myMessageBg: '#bb86fc',
            text: '#e0e0e0',
            myMessageText: '#000000',
            border: '#333333'
        }
    },
    nature: {
        name: 'Природа',
        gradients: {
            background: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)',
            myMessage: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            theirMessage: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            header: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)'
        },
        colors: {
            primary: '#2e7d32',
            secondary: '#ff9800',
            background: '#f1f8e9',
            messageBg: '#e8f5e8',
            myMessageBg: '#4caf50',
            text: '#1b5e20',
            myMessageText: '#ffffff',
            border: '#c8e6c9'
        }
    },
    ocean: {
        name: 'Океан',
        gradients: {
            background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)',
            myMessage: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)',
            theirMessage: 'linear-gradient(135deg, #b3e5fc 0%, #81d4fa 100%)',
            header: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)'
        },
        colors: {
            primary: '#0288d1',
            secondary: '#fbc02d',
            background: '#e1f5fe',
            messageBg: '#b3e5fc',
            myMessageBg: '#0288d1',
            text: '#01579b',
            myMessageText: '#ffffff',
            border: '#81d4fa'
        }
    },
    sunset: {
        name: 'Закат',
        gradients: {
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            myMessage: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)',
            theirMessage: 'linear-gradient(135deg, #ffe0b2 0%, #ffcc80 100%)',
            header: 'linear-gradient(135deg, #e65100 0%, #bf360c 100%)'
        },
        colors: {
            primary: '#e65100',
            secondary: '#ffab00',
            background: '#fff3e0',
            messageBg: '#ffe0b2',
            myMessageBg: '#e65100',
            text: '#bf360c',
            myMessageText: '#ffffff',
            border: '#ffcc80'
        }
    },
    modern: {
        name: 'Модерн',
        gradients: {
            background: 'linear-gradient(135deg, #fafafa 0%, #f3e5f5 100%)',
            myMessage: 'linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)',
            theirMessage: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
            header: 'linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)'
        },
        colors: {
            primary: '#9c27b0',
            secondary: '#00bcd4',
            background: '#fafafa',
            messageBg: '#f3e5f5',
            myMessageBg: '#9c27b0',
            text: '#4a148c',
            myMessageText: '#ffffff',
            border: '#e1bee7'
        }
    },
    gradient: {
        name: 'Градиент',
        gradients: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            myMessage: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            theirMessage: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            header: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        colors: {
            primary: '#667eea',
            secondary: '#f093fb',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            messageBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            myMessageBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            text: '#ffffff',
            myMessageText: '#ffffff',
            border: 'rgba(255,255,255,0.2)'
        }
    }
};


export const getDefaultTheme = () => 'default';

export const applyThemeToDocument = (theme) => {
    const root = document.documentElement;

    Object.entries(theme.gradients).forEach(([key, value]) => {
        root.style.setProperty(`--chat-${key}-gradient`, value);
    });

    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--chat-${key}`, value);
    });
};