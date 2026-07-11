import React, { memo, useCallback } from 'react';
import { useGetLikeStateQuery, useToggleLikeMutation } from '../../api/modules/likePost';

const HeartIcon = memo(({ isLiked }) => (
    <span className="text-lg" aria-hidden="true">
        {isLiked ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
            </svg>
        ) : '🤍'}
    </span>
));

const LikeButton = memo(({ postId, initialCount = 0 }) => {
    const stringPostId = String(postId);

    const { data, isLoading } = useGetLikeStateQuery(stringPostId, {
        skip: !postId,
        refetchOnMountOrArgChange: true,
    });

    const [toggleLike, { isLoading: isToggling }] = useToggleLikeMutation();

    const count = data?.count ?? initialCount ?? 0;
    const isLiked = data?.liked ?? false;
    const isPending = isLoading || isToggling;

    const handleClick = useCallback(async () => {
        if (isPending) return;
        try {
            await toggleLike(stringPostId).unwrap();
        } catch (err) {
            console.error('Ошибка лайка:', err);
        }
    }, [isPending, toggleLike, stringPostId]);

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isPending}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition select-none ${
                isLiked 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${isPending ? 'opacity-60 cursor-wait pointer-events-none' : ''}`}
        >
            <HeartIcon isLiked={isLiked} />
            <span className="text-sm font-medium">{count}</span>
        </button>
    );
});

export default LikeButton;