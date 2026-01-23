import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { fetchPosts,clearPosts   } from '../../store/Post';

import { Link } from 'react-router-dom';
import Comments from './Comment';

const UserPosts = ({ userId }) => {
    const dispatch = useDispatch();


    const { posts, postsLoading, postsError } = useSelector(state => state.post);
    const [expandedPost, setExpandedPost] = useState(null);

    useEffect(() => {
        dispatch(fetchPosts());
        return () => {
            dispatch(clearPosts());
        }
    }, [dispatch, userId]);

    const toggleComments = (postId) => {
        setExpandedPost(expandedPost === postId ? null : postId);
    };

    if (postsLoading) {
        return (
            <div className="posts-container">
                <h2>Лента постов</h2>
                <div className="loading-container">
                    <p>Загрузка постов...</p>
                </div>
            </div>
        );
    }

    if (postsError) {
        return (
            <div className="posts-container">
                <h2>Лента постов</h2>
                <div className="error-container">
                    <p>Ошибка при загрузке постов: {postsError}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full max-w-2xl mx-auto my-5 p-5">
          <h2 className="text-xl font-semibold text-center mb-5">Лента постов</h2>

          {!posts || posts.length === 0 ? (
            <span className="block text-center text-gray-500">Пока нет ни одного поста</span>
          ) : (
            <div className="flex flex-col gap-5 mt-5">
              {posts.map(post => {
                const userName = post.user?.profile?.name;
                const userAvatar = post.user?.profile?.avatar || post.user?.avatar || null;
                const userId = post.user?.id || post.user_id;

                return (
                  <div key={post.id} className="w-full max-w-lg mx-auto bg-[rgba(1,14,24,0.946)] rounded-lg shadow-md overflow-hidden">

                    <div className="flex items-center p-3 mb-4">
                      <Link to={`/profile/${userId}`}>
                        <img
                          src={userAvatar || 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'}
                          className="w-10 h-10 rounded-full object-cover mx-2"
                          alt="Аватар пользователя"
                        />
                      </Link>

                      <div className="flex flex-col ml-2">
                        <span className="text-white font-medium mx-2">{userName}</span>
                        <span className="text-gray-300 text-xs mx-2">
                          {new Date(post.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>


                    {post.images && (
                      <img
                        src={post.images}
                        alt="Post"
                        className="w-full max-h-96 object-cover"
                      />
                    )}

                    {post.videos && (
                      <div className="w-full max-w-full my-2">
                        <video controls className="w-full max-h-96 rounded-lg bg-black">
                          <source src={post.videos} type="video/mp4" />
                        </video>
                      </div>
                    )}


                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                      <p className="text-gray-100 leading-relaxed">{post.content}</p>
                    </div>


                    <div className="p-3 border-t border-gray-700">
                      <button
                        onClick={() => toggleComments(post.id)}
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
                          <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                          <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
                        </svg>
                        Комментарии
                      </button>
                    </div>


                    {expandedPost === post.id && (
                      <Comments postId={post.id} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
};

export default UserPosts;