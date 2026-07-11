import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../configAuth';


export const commentsApi = createApi({
    reducerPath: 'commentsApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['Comment'],

    endpoints: (build) => ({
        getComments: build.query({
            query: (postId) => `/posts/${postId}/comments`,
            providesTags: (result, error, postId) =>
                result?.comments  
                    ? [
                        ...result.comments.map(({ id }) => ({ type: 'Comment', id })),
                        { type: 'Comment', id: `POST_${postId}` }
                    ]
                    : [{ type: 'Comment', id: `POST_${postId}` }],
        
            transformResponse: (response) => {
                return {
                    comments: response?.comments || response?.data || [],
                };
            },
        }),

        createComment: build.mutation({
            query: ({ postId, comment }) => ({
                url: `/posts/${postId}/comments`,
                method: 'POST',
                body: { comment },
            }),

            async onQueryStarted({ postId, comment }, { dispatch, queryFulfilled }) {
                const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                const patchResult = dispatch(
                    commentsApi.util.updateQueryData('getComments', postId, (draft) => {

                        if (!draft?.comments) {
                            draft.comments = [];
                        }
                        draft.comments.unshift({
                            id: tempId,
                            comment,
                            created_at: new Date().toISOString(),
                            user_id: null,
                            user: null,
                            isOptimistic: true,
                        });
                    })
                );

                try {
                    const { data } = await queryFulfilled;
                    
             
                    dispatch(
                        commentsApi.util.updateQueryData('getComments', postId, (draft) => {
                            if (!draft?.comments) return;
                            const index = draft.comments.findIndex(c => c.id === tempId);
                            if (index !== -1 && data?.comment) {
                                draft.comments[index] = data.comment;
                            }
                        })
                    );
                } catch (error) {
                    patchResult.undo();
                    console.error('Failed to create comment:', error);
                }
            },

            invalidatesTags: (result, error, { postId }) => [
                { type: 'Comment', id: `POST_${postId}` }
            ],
        }),

        deleteComment: build.mutation({
            query: ({ postId, commentId }) => ({
                url: `/comments/${commentId}`,
                method: 'DELETE',
            }),

            async onQueryStarted({ postId, commentId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    commentsApi.util.updateQueryData('getComments', postId, (draft) => {
                        if (!draft?.comments) return;
                        draft.comments = draft.comments.filter(c => c.id !== commentId);
                    })
                );

                try {
                    await queryFulfilled;
                } catch (error) {
                    patchResult.undo();
                    console.error('Failed to delete comment:', error);
                }
            },

            invalidatesTags: (result, error, { postId }) => [
                { type: 'Comment', id: `POST_${postId}` }
            ],
        }),
    }),
});


export const {
    useGetCommentsQuery,
    useCreateCommentMutation,
    useDeleteCommentMutation,
} = commentsApi;

export default commentsApi;  