
import React, { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Comments from './Comment';
import LikeButton from '../../UI/Post/LikeButton';
import { normalizeMediaUrl, DEFAULT_AVATAR } from '../../utils/mediaUrl';

const getProfileName = (post) => {
    return post?.profile?.name
        || post?.user?.profile?.name
        || 'Пользователь';
};

const getProfileAvatar = (post) => {
    return normalizeMediaUrl(post?.profile?.avatar
        || post?.user?.profile?.avatar
        || post?.user?.avatar)
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
    const [commentCount, setCommentCount] = useState(post.comments_count ?? 0);

    useEffect(() => {
        setCommentCount(post.comments_count ?? 0);
    }, [post.comments_count]);

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
                    src={normalizeMediaUrl(post.images)}
                    alt={post.title || 'Post image'}
                    className="w-full h-[300px] sm:h-[400px] object-cover cursor-pointer"
                    onClick={() => onImageClick(normalizeMediaUrl(post.images))}
                    onError={handleImageError}
                />
            )}

            {post.videos && (
                <div className="w-full max-w-full my-2">
                    <video
                        controls
                        className="w-full h-[300px] sm:h-[400px] rounded-lg bg-black"
                        poster={normalizeMediaUrl(post.images) || ''}
                    >
                        <source src={normalizeMediaUrl(post.videos)} type="video/mp4" />
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
                    <span>Комментарии</span>
                    <span className="min-w-6 h-6 px-1.5 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                        {commentCount}
                    </span>
                </button>
            </div>

            {isExpanded && (
                <Comments postId={post.id} onCountChange={setCommentCount} />
            )}
        </div>
    );
});

export default PostCard;
