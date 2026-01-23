import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    loadBackground,
    uploadBackground,
    selectBackgroundByUserId,
} from "../../store/BacroundImages";

const ImageChat = (props) => {

    const {
    forChatBackground,
    onBackgroundSet,
    currentBackground
    } =props;


    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const { token, user } = useSelector((state) => state.user);
    const { loading, error } = useSelector((state) => state.background);

    const backgroundImage = useSelector((state) => selectBackgroundByUserId(state, user?.id));
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        if (user?.id && token) {
            console.log('Loading background for user:', user.id);
            dispatch(loadBackground(user.id, token));
        }
    }, [user?.id, token, dispatch]);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setLocalError("Пожалуйста, выберите изображение");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setLocalError("Размер изображения не должен превышать 2MB");
            return;
        }

        if (forChatBackground) {
            await setChatBackground(file);
        }

        e.target.value = '';
    };

    const setChatBackground = async (file) => {

            const result = await dispatch(uploadBackground(file, user.id, token));
            if (result.success && result.path_image) {

                if (onBackgroundSet) {
                    onBackgroundSet(result.path_image);
                }

            }

    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };



    return (
        <div className="image-container">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: "none" }}
            />

            <div className="chat-background-controls">
                <div className="background-actions">
                    <button
                        type="button"
                        onClick={handleClick}

                        className="background-btn"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-camera"
                            viewBox="0 0 16 16"
                        >
                            <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z" />
                            <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
                        </svg>
                        <span>Выбрать фон для чата</span>
                    </button>

                    {currentBackground && (
                        <div className="background-status">
                            <span style={{ color: "green", fontSize: "12px" }}>
                                ✓ Фон установлен
                            </span>
                        </div>
                    )}
                </div>
            </div>



            {(localError || error) && (
                <div
                    className="error-message"
                    style={{ color: "red", marginTop: "10px", fontSize: "12px" }}
                >
                    {localError || error}
                </div>
            )}
        </div>
    );
}

export default ImageChat;
