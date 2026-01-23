import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = useSelector(state => state.user.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {


            const formData = new FormData();
            if (image) formData.append('image', image);
            if (video) formData.append('video', video);
            formData.append('title', title);
            formData.append('content', content);
            const response = await axios.post('/posts', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });

            if (response.data.success) {
                navigate('/home');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Ошибка при создании поста');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setVideo(null);
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 100 * 1024 * 1024) {
                setError('Видео слишком большое. Максимальный размер: 100MB');
                return;
            }

            setVideo(file);
            setImage(null);
            setError('');
        }
    };

    return (
        <div className="
            w-full
            max-w-96          /* Мобильные: максимум 96 */
            sm:max-w-md      /* Маленькие экраны: 448px */
            md:max-w-lg      /* Средние экраны: 512px */
            lg:max-w-xl      /* Большие экраны: 576px */
            xl:max-w-2xl     /* Очень большие: 672px */
            mx-auto
            my-5
            p-5
            bg-[#0a1929]
            rounded-lg
            shadow-md
        ">
            <h2 className="text-2xl font-semibold text-white text-center mb-5">
                Создать пост
            </h2>

            {error && (
                <div className="text-red-500 mb-5 p-3 bg-blue-900 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="title" className="block text-white font-semibold mb-2">
                        Название поста
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название поста"
                        required
                        className="
                            w-full
                            px-3
                            py-2
                            border
                            border-gray-600
                            rounded-lg
                            bg-gray-800
                            text-white
                            focus:border-blue-500
                            focus:outline-none
                            transition-colors
                        "
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="content" className="block text-white font-semibold mb-2">
                        Описание
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Описание поста"
                        rows="5"
                        className="
                            w-full
                            px-3
                            py-2
                            border
                            border-gray-600
                            rounded-lg
                            bg-gray-800
                            text-white
                            focus:border-blue-500
                            focus:outline-none
                            transition-colors
                            resize-y
                            min-h-[150px]
                        "
                    />
                </div>

                <div className="mb-5">
                    <label htmlFor="image" className="block text-white font-semibold mb-2">
                        Загрузить фото
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="
                            w-full
                            px-3
                            py-2
                            border
                            border-gray-600
                            rounded-lg
                            bg-gray-800
                            text-white
                            file:mr-4
                            file:py-2
                            file:px-4
                            file:rounded-full
                            file:border-0
                            file:text-sm
                            file:font-semibold
                            file:bg-blue-50
                            file:text-blue-700
                            hover:file:bg-blue-100
                        "
                    />
                    {image && (
                        <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="max-w-full max-h-80 rounded-lg mx-auto"
                            />
                            <p className="text-white text-sm mt-2 text-center">
                                Выбранное фото: {image.name}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mb-5">
                    <label htmlFor="video" className="block text-white font-semibold mb-2">
                        Загрузить видео
                    </label>
                    <input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="
                            w-full
                            px-3
                            py-2
                            border
                            border-gray-600
                            rounded-lg
                            bg-gray-800
                            text-white
                            file:mr-4
                            file:py-2
                            file:px-4
                            file:rounded-full
                            file:border-0
                            file:text-sm
                            file:font-semibold
                            file:bg-blue-50
                            file:text-blue-700
                            hover:file:bg-blue-100
                        "
                    />
                    {video && (
                        <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                            <video
                                controls
                                className="max-w-full max-h-80 rounded-lg mx-auto"
                            >
                                <source src={URL.createObjectURL(video)} type={video.type} />
                                Your browser does not support the video tag.
                            </video>
                            <p className="text-white text-sm mt-2 text-center">
                                Выбранное видео: {video.name}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="
                            px-4
                            py-2
                            bg-red-600
                            text-white
                            rounded-lg
                            hover:bg-red-700
                            transition-colors
                            cursor-pointer
                        "
                        onClick={() => navigate(-1)}
                    >
                        Выйти
                    </button>
                    <button
                        type="submit"
                        className="
                            px-4
                            py-2
                            bg-blue-600
                            text-white
                            rounded-lg
                            hover:bg-blue-700
                            transition-colors
                            disabled:bg-gray-600
                            disabled:cursor-not-allowed
                        "
                        disabled={isLoading || (!image && !video)}
                    >
                        {isLoading ? 'Создание поста...' : 'Создать пост'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;