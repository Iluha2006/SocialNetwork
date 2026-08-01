
import { useState, useMemo, useCallback } from 'react';
import { useGetAllPostsQuery } from '../../api/modules/postApi';

const useFeedPosts = () => {
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

    return {
        safePosts,
        isLoading,
        isError,
        refetch,
        expandedPost,
        selectedImage,
        toggleComments,
        handleImageClick,
        handleCloseModal,
    };
};

export default useFeedPosts;
