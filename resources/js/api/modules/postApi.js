
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../configAuth';

export const postsApi = createApi({
    reducerPath: 'postsApi',
    baseQuery: baseQueryWithCsrf, 
    tagTypes: ['Post'],

    endpoints: (build) => ({
        
       getAllPosts: build.query({
            query: () => '/posts',
            transformResponse: (response) => {
                return response?.data || response || [];
            },
           providesTags: (result) =>
    result?.length  
        ? [...result.map(({ id }) => ({ type: 'Post', id })), { type: 'Post', id: 'LIST' }]
        : [{ type: 'Post', id: 'LIST' }],
        }),
getUserPosts: build.query({
            query: (userId) => `/posts/user/${userId}`,
            transformResponse: (response) => {
                return response?.data || response || [];
            },
            providesTags: (result, error, userId) =>
                result?.length
                    ? [...result.map(({ id }) => ({ type: 'Post', id })), { type: 'Post', id: `USER_${userId}` }]
                    : [{ type: 'Post', id: `USER_${userId}` }],
        }),
    
        createPost: build.mutation({
            query: (formData) => ({
                url: '/posts',
                method: 'POST',
                body: formData,
                
            }),
    
            invalidatesTags: [{ type: 'Post', id: 'LIST' }],
        }),

      
        updatePost: build.mutation({
            query: ({ postId, ...data }) => ({
                url: `/posts/${postId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: 'Post', id: postId },
                { type: 'Post', id: 'LIST' }
            ],
        }),

       
        deletePost: build.mutation({
            query: (postId) => ({
                url: `/posts/${postId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, postId) => [
                { type: 'Post', id: postId },
                { type: 'Post', id: 'LIST' }
            ],
        }),
    }),
});


export const {
    useGetAllPostsQuery,    
    useGetUserPostsQuery, 
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postsApi;

export default postsApi;