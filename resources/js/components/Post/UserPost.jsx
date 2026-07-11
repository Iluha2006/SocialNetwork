
import React, { useState, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';

import { useGetAllPostsQuery } from '../../api/modules/postApi';

import Comments from './Comment';
import LikeButton from '../../UI/Post/LikeButton';

const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E';

const getProfileName = (post) => {
    return post?.profile?.name
        || post?.user?.profile?.name
        || 'Пользователь';
};

const getProfileAvatar = (post) => {
    return post?.profile?.avatar
        || post?.user?.profile?.avatar
        || post?.user?.avatar
        || DEFAULT_AVATAR;
};

const getPostUserId = (post) => {
    return post?.user_id
        || post?.user?.id
        || post?.profile?.user_id;
};

const handleAvatarError = (e) => {
    if (e.target.src === DEFAULT_AVATAR) return;
    e.target.src = DEFAULT_AVATAR;
};

const handleImageError = (e) => {
    e.target.style.display = 'none';
};

const PostCard = memo(({ post, isExpanded, onToggleComments, onImageClick }) => {
    const userName = getProfileName(post);
    const userAvatar = getProfileAvatar(post);
    const postUserId = getPostUserId(post);

    return (
        <div className="w-full bg-[rgba(1,14,24,0.946)] rounded-lg shadow-md overflow-hidden min-h-[400px] sm:min-h-[300px]">
            <div className="flex items-center justify-between p-3 mb-4">
                <div className="flex items-center">
                    <Link to={`/profile/${postUserId}`}>
                        <img
                            src={userAvatar}
                            className="w-10 h-10 rounded-full object-cover mx-2"
                            onError={handleAvatarError}
                        />
                    </Link>
                    <div className="flex flex-col ml-2">
                        <span className="text-white font-medium mx-2">
                            {userName}
                        </span>
                        <span className="text-gray-300 text-xs mx-2">
                            {post.created_at
                                ? new Date(post.created_at).toLocaleDateString('ru-RU')
                                : ''
                            }
                        </span>
                    </div>
                </div>

                <LikeButton
                    postId={post.id}
                    initialCount={post.likes_count}
                />
            </div>

            {post.images && (
                <img
                    src={post.images}
                    alt={post.title || 'Post image'}
                    className="w-full h-[400px] sm:h-[600px] object-cover cursor-pointer"
                    onClick={() => onImageClick(post.images)}
                    onError={handleImageError}
                />
            )}

            {post.videos && (
                <div className="w-full max-w-full my-2">
                    <video
                        controls
                        className="w-full h-[400px] sm:h-[500px] rounded-lg bg-black"
                        poster={post.images || ''}
                    >
                        <source src={post.videos} type="video/mp4" />
                        Ваш браузер не поддерживает видео.
                    </video>
                </div>
            )}

            <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                    {post.title}
                </h3>
                <p className="text-gray-100 leading-relaxed">
                    {post.content}
                </p>
            </div>

            <div className="p-3 border-t border-gray-700">
                <button
                    onClick={() => onToggleComments(post.id)}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mx-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-chat-dots"
                        viewBox="0 0 16 16"
                    >
                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
                    </svg>
                    Комментарии
                </button>
            </div>

            {isExpanded && (
                <Comments postId={post.id} />
            )}
        </div>
    );
});

const ImageModal = memo(({ image, onClose }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
        <button
            className="absolute top-4 right-4 text-white text-3xl w-10 h-10 flex items-center justify-center bg-red-500 rounded-full z-50 transition-colors hover:bg-red-600"
            onClick={onClose}
        >
            ×
        </button>
        <img
            src={image}
            alt="Просмотр фото"
            className="max-w-full max-h-[120vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
        />
    </div>
));

const UserPosts = memo(({ userId }) => {
    const [expandedPost, setExpandedPost] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const {
        data: posts,
        isLoading,
        isError,
        refetch
    } = useGetAllPostsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const safePosts = useMemo(() => {
        if (!posts) return [];
        if (Array.isArray(posts)) return posts;
        if (posts?.data && Array.isArray(posts.data)) return posts.data;
        if (posts?.posts && Array.isArray(posts.posts)) return posts.posts;
        return [];
    }, [posts]);

    const toggleComments = useCallback((postId) => {
        setExpandedPost((prev) => prev === postId ? null : postId);
    }, []);

    const handleImageClick = useCallback((src) => {
        setSelectedImage(src);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedImage(null);
    }, []);

    if (isLoading) {
        return (
            <div className="posts-container">
                <h2>Лента постов</h2>
                <div className="loading-container">
                    <p>Загрузка постов...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="posts-container">
                <h2>Лента постов</h2>
                <div className="error-container">
                    <p>Ошибка при загрузке постов. <button onClick={refetch} className="text-blue-400 underline">Повторить</button></p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full sm:w-[700px] mx-auto px-0 sm:px-4 my-5">
                {safePosts.length === 0 ? (
                    <h1 className="block text-center text-gray-500">Пока нет ни одного поста</h1>
                ) : (
                    <div className="flex flex-col gap-5 mt-5 items-center">
                        {safePosts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                isExpanded={expandedPost === post.id}
                                onToggleComments={toggleComments}
                                onImageClick={handleImageClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedImage && (
                <ImageModal image={selectedImage} onClose={handleCloseModal} />
            )}
        </>
    );
});

export default UserPosts;