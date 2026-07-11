import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    loadBackground,
    uploadBackground,
    selectBackgroundByUserId,
} from "../../store/Files/BacroundImages";

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
        <div className="flex flex-col items-start gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleClick}

                        className="w-47 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r
                         from-blue-500 to-blue-600 hover:from-blue-300
                          hover:to-blue-700 text-white font-medium rounded-xl 
                          shadow-md hover:shadow-lg transition-all duration-200 
                          transform hover:scale-[1.02] active:scale-[0.98] 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

                </div>
                    {currentBackground && (
                        <div className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-md">
                            ✓ Фон установлен
                        </div>
                    )}
            </div>



            {(localError || error) && (
                <div className="text-red-500 text-xs mt-2">
                    {localError || error}
                </div>
            )}
        </div>
    );
}

export default ImageChat;
