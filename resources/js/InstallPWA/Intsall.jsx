import React, { useState, useEffect, useRef } from 'react';
import './InstallPWA.css';
import { useSelector } from 'react-redux';

const InstallPWA = () => {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [userDismissed, setUserDismissed] = useState(false);
    const { user } = useSelector(state => state.user);
    const intervalRef = useRef(null);


    useEffect(() => {
        if (user?.id) {
            const dismissed = localStorage.getItem(`InstallDismissed_${user.id}`);
            if (dismissed === 'true') {
                setUserDismissed(true);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [user]);

    const savePrompt = (event) => {
        event.preventDefault();
        setInstallPrompt(event);


        if (!userDismissed) {
            setShowInstallButton(true);
        }
    };

    const installPWA = async () => {
        if (installPrompt) {
            try {
                await installPrompt.prompt();
                const choiceResult = await installPrompt.userChoice;

                if (choiceResult.outcome === 'accepted') {
                    console.log('Пользователь принял установку');

                    if (user?.id) {
                        localStorage.setItem(`Install_${user.id}`, 'true');
                        localStorage.removeItem(`pwaInstallDismissed_${user.id}`);
                    }
                } else {
                    console.log('Пользователь отклонил установку');

                    if (user?.id) {
                        localStorage.setItem(`InstallDismissed_${user.id}`, 'true');
                        setUserDismissed(true);
                    }
                }
            } catch (error) {
                console.error('Ошибка при вызове prompt:', error);
            } finally {
                setShowInstallButton(false);
                setInstallPrompt(null);
            }
        }
    };

    const handleAppInstalled = () => {
        console.log('PWA было установлено');
        setShowInstallButton(false);
        setInstallPrompt(null);
        if (user?.id) {
            localStorage.setItem(`Install_${user.id}`, 'true');
            localStorage.removeItem(`InstallDismissed_${user.id}`);
        }
    };

    const handleDismiss = () => {
        setShowInstallButton(false);
        setUserDismissed(true);

        if (user?.id) {
            localStorage.setItem(`InstallDismissed_${user.id}`, 'true');
        }
    };

    useEffect(() => {

        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            setIsStandalone(true);
            setShowInstallButton(false);

            if (user?.id) {
                localStorage.setItem(`Install_${user.id}`, 'true');
                localStorage.removeItem(`InstallDismissed_${user.id}`);
            }
            return;
        }


        if (user?.id) {
            const isInstalled = localStorage.getItem(`Install_${user.id}`) === 'true';
            if (isInstalled) {
                setShowInstallButton(false);
                return;
            }
        }


        window.addEventListener('beforeinstallprompt', savePrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', savePrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [user, userDismissed]);


    if (isStandalone || userDismissed) {
        return null;
    }

    return (
        <div className="install-prompt">
            <div className="install-content">
                <h3>Установить приложение</h3>
                <div className="install-buttons">
                    <button onClick={installPWA} className="install-button">
                        Установить
                    </button>
                    <button onClick={handleDismiss} className="dismiss-button">
                        Не сейчас
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPWA;
