
import React, { memo } from 'react';

import useFeedPosts from '../../hooks/Post/useFeedPosts';
import PostCard from './PostCard';
import ImageModal from '../../UI/Post/ImageModal';
import LoadingSpinner from '../../UI/States/UserProfile/LoadingSpinner';

const UserPosts = memo(() => {
    const {
        safePosts,
        isLoading,
        isError,
        refetch,
        expandedPost,
        selectedImage,
        toggleComments,
        handleImageClick,
        handleCloseModal,
    } = useFeedPosts();

    if (isLoading) {
        return <LoadingSpinner text="Загрузка постов..." />;
    }

    if (isError) {
        return (
            <div className="w-full sm:w-[700px] mx-auto px-0 sm:px-4 my-5">
                <div className="text-center py-10">
                    <p className="text-gray-400 mb-3">Ошибка при загрузке постов.</p>
                    <button
                        onClick={refetch}
                        className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    >
                        Повторить
                    </button>
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
