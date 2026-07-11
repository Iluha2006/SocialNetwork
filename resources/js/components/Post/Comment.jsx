
import React, { useState, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { 
    useGetCommentsQuery, 
    useCreateCommentMutation, 
    useDeleteCommentMutation 
} from '../../api/modules/commentsApi';

const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E';

const handleAvatarError = (e) => {
    if (e.target.src === DEFAULT_AVATAR) return;
    e.target.src = DEFAULT_AVATAR;
};

const CommentItem = memo(({ comment, currentUserId, isDeleting, onDelete, onViewProfile }) => {
    const canDelete = currentUserId && comment.user_id === currentUserId;

    return (
        <div className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-start mb-3">
                <img
                    onClick={() => onViewProfile(comment.user_id)}
                    src={comment.user?.avatar || comment.user?.profile?.avatar || DEFAULT_AVATAR}
                    alt="Аватар"
                    className="w-8 h-8 rounded-full object-cover mr-3 cursor-pointer flex-shrink-0"
                    onError={handleAvatarError}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <span
                                className="text-white font-medium text-sm cursor-pointer hover:text-blue-300 transition-colors"
                                onClick={() => onViewProfile(comment.user_id)}
                            >
                                {comment.user?.name || comment.user?.profile?.name || 'Аноним'}
                            </span>
                            <span className="text-gray-400 text-xs ml-2">
                                {new Date(comment.created_at).toLocaleString('ru-RU')}
                            </span>
                        </div>

                        {canDelete && (
                            <button
                                onClick={() => onDelete(comment.id)}
                                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed ml-2 flex-shrink-0"
                                title="Удалить комментарий"
                                disabled={isDeleting}
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
    );
});

const Comments = memo(({ postId }) => {
    const [commentText, setCommentText] = useState('');
    const navigate = useNavigate();

    const { user, isAuthenticated } = useSelector(state => state.user);

    const { 
        data: commentsData, 
        isLoading: commentsLoading, 
        error: commentsError 
    } = useGetCommentsQuery(postId, { 
        skip: !postId 
    });

    const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

    const postComments = commentsData?.comments || [];

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!commentText.trim() || isCreating) return;

        try {
            await createComment({ postId, comment: commentText }).unwrap();
            setCommentText('');
        } catch (error) {
            console.error('Ошибка отправки:', error);
        }
    }, [commentText, isCreating, createComment, postId]);

    const handleTextChange = useCallback((e) => {
        setCommentText(e.target.value);
    }, []);

    const handleDeleteComment = useCallback(async (commentId) => {
        if (isDeleting) return;
        try {
            await deleteComment({ postId, commentId }).unwrap();
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    }, [isDeleting, deleteComment, postId]);

    const handleViewProfile = useCallback((userId) => {
        navigate(`/profile/${userId}`);
    }, [navigate]);

    if (commentsError) {
        const errorMsg = commentsError?.data?.message || 'Не удалось загрузить комментарии';
        return <div className="error">Ошибка: {errorMsg}</div>;
    }

    return (
        <div className="mt-5 p-4 border-t border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4">
                Комментарии ({postComments.length})
            </h4>

            {isAuthenticated && user && (
                <form onSubmit={handleSubmit} className="mb-5">
                    <textarea
                        value={commentText}
                        onChange={handleTextChange}
                        placeholder="Напишите комментарий..."
                        rows="3"
                        className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white resize-y mb-3 focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                        maxLength="1000"
                        disabled={isCreating}
                    />

                    <button
                        type="submit"
                        disabled={!commentText.trim() || isCreating}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isCreating ? 'Отправка...' : 'Отправить'}
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {postComments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUserId={user?.id}
                        isDeleting={isDeleting}
                        onDelete={handleDeleteComment}
                        onViewProfile={handleViewProfile}
                    />
                ))}

                {commentsLoading && (
                    <p className="text-center text-gray-400 py-4">Загрузка комментариев...</p>
                )}
                
                {!commentsLoading && postComments.length === 0 && (
                    <p className="text-center text-gray-500 italic py-4">Пока нет комментариев</p>
                )}
            </div>
        </div>
    );
});

export default Comments;