import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../configAuth';

export const likePostApi = createApi({
    reducerPath: 'likePostApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['LikePost'],

    endpoints: (build) => ({



    
getLikeState: build.query({
    query: (postId) => `/posts/${postId}/likes/count`,
    providesTags: (result, error, postId) => [{ type: 'LikePost', id: String(postId) }],
    
 
}),

        toggleLike: build.mutation({
            query: (postId) => ({
                url: `/posts/${postId}/like`,
                method: 'POST',
            }),

            async onQueryStarted(postId, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    likePostApi.util.updateQueryData('getLikeState', String(postId), (draft) => {
                        if (!draft) return;
                        const currentCount = Number(draft.count) || 0;
                        const currentLiked = !!draft.liked;
                        
                        if (currentLiked) {
                            draft.count = Math.max(0, currentCount - 1);
                            draft.liked = false;
                        } else {
                            draft.count = currentCount + 1;
                            draft.liked = true;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                    console.error('Like toggle failed:', error);
                }
            },

            invalidatesTags: (result, error, postId) => [
                { type: 'LikePost', id: String(postId) },
                { type: 'Post', id: String(postId) },
                { type: 'Post', id: 'LIST' },
            ],
        }),
    }),
});

export const { useGetLikeStateQuery, useToggleLikeMutation } = likePostApi;
export default likePostApi;