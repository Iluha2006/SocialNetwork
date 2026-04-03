import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import { createComment , fetchComments, deleteComment } from '../../store/PostUser/Post';


const Comments = ({ postId }) => {
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { comments, commentsLoading, commentsError } = useSelector(state => state.post);
    const { user } = useSelector(state => state.user);
    const { isAuthenticated } = useSelector(state => state.user);

    const postComments = comments[postId] || [];

    useEffect(() => {
        dispatch(fetchComments(postId));
    }, [dispatch, postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || submitting) return;

        setSubmitting(true);
        setSubmitError('');

        try {
            const result = await dispatch(createComment(postId, commentText));
            if (result.success) {
                setCommentText('');
            } else {
                setSubmitError(result.error || 'Ошибка при отправке комментария');
            }

        } catch (error) {
            setSubmitError('Ошибка при отправке комментария');

        } finally {
            setSubmitting(false);
        }
    };
    const handleViewProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };
    const handleDeleteComment = async (commentId) => {
            try {
             const res=   await dispatch(deleteComment(postId, commentId));
             console.log(res)
            } catch (error) {
                console.error('Ошибка удаления комментария:', res);
            }

    };


    if (commentsError) return <div className="error">Ошибка: {commentsError}</div>;

    return (
        <div className="mt-5 p-4 border-t border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4">Комментарии ({postComments.length})</h4>

        {isAuthenticated && user && (
            <form onSubmit={handleSubmit} className="mb-5">
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Напишите комментарий..."
                    rows="3"
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white resize-y mb-3 focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                    maxLength="1000"
                    disabled={submitting}
                />

                {submitError && (
                    <div className="text-red-500 mb-3 text-sm">
                        {submitError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!commentText.trim() || submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Отправка...' : 'Отправить'}
                </button>
            </form>
        )}

        <div className="space-y-4">
            {postComments.map(comment => (
                <div key={comment.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-start mb-3">
                        <img
                            onClick={() => handleViewProfile(comment.user_id)}
                            src={comment.user?.avatar || comment.user?.profile?.avatar || 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'}
                            alt="Аватар"
                            className="w-8 h-8 rounded-full object-cover mr-3 cursor-pointer flex-shrink-0"
                            onError={(e) => {
                                e.target.src = 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13';
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span
                                        className="text-white font-medium text-sm cursor-pointer hover:text-blue-300 transition-colors"
                                        onClick={() => handleViewProfile(comment.user_id)}
                                    >
                                        {comment.user?.name || comment.user?.profile?.name || 'Аноним'}
                                    </span>
                                    <span className="text-gray-400 text-xs ml-2">
                                        {new Date(comment.created_at).toLocaleString('ru-RU')}
                                    </span>
                                </div>

                                {user && comment.user_id === user.id && (
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed ml-2 flex-shrink-0"
                                        title="Удалить комментарий"
                                        disabled={submitting}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-trash"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <p className="text-white text-sm mt-2 leading-relaxed">{comment.comment}</p>
                        </div>
                    </div>
                </div>
            ))}

            {postComments.length === 0 && (
                <p className="text-center text-gray-500 italic py-4">Пока нет комментариев</p>
            )}
        </div>
    </div>
    );
};
export default Comments;
