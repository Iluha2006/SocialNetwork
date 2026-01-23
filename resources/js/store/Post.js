import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const PostSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
        comments: {},
        loading: false,
        postsLoading: false,
        postsError: null,
    },

    reducers: {
        setPosts(state, action) {
            state.posts = action.payload;
        },
        setPostsLoading(state, action) {
            state.postsLoading = action.payload;
        },
        setPostsError(state, action) {
            state.postsError = action.payload;
        },
        clearPosts(state) {
            state.posts = [];
        },
        setComments: (state, action) => {
            const { postId, comments } = action.payload;
            state.comments[postId] = comments;
        },

        addComment: (state, action) => {
            const { postId, comment } = action.payload;
            if (!state.comments[postId]) {
                state.comments[postId] = [];
            }
            state.comments[postId].unshift(comment);
        },

        removeComment: (state, action) => {
            const { postId, commentId } = action.payload;
            if (state.comments[postId]) {
                state.comments[postId] = state.comments[postId].filter(
                    comment => comment.id !== commentId
                );
            }
        },

        setCommentsLoading: (state, action) => {
            state.commentsLoading = action.payload;
        },

        setCommentsError: (state, action) => {
            state.commentsError = action.payload;
        },

        clearComments: (state) => {
            state.comments = {};
            state.commentsError = null;
        },
    }
});


export const fetchComments = (postId) => async (dispatch, getState) => {
    try {
        dispatch(setCommentsLoading(true));
        const token = getState().user.token;

        const response = await axios.get(`/posts/${postId}/comments`, {
            headers: {
              //  'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

        });

        dispatch(setComments({ postId, comments: response.data.comments }));
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Ошибка загрузки комментариев';
        dispatch(setCommentsError(errorMsg));
    } finally {
        dispatch(setCommentsLoading(false));
    }
};

export const fetchPosts = () => async (dispatch, getState) => {
    try {
        dispatch(setPostsLoading(true));
        const token = getState().user.token;
        const response = await axios.get(`/posts`, {
            headers: {
             //   'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

        });

        dispatch(setPosts(response.data));
        dispatch(setPostsLoading(false));
    } catch (err) {
        dispatch(setPostsError(err.response?.data?.message || 'Ошибка загрузки постов'));
        dispatch(setPostsLoading(false));
    }
};

export const createComment = (postId, commentText) => async (dispatch, getState) => {
    try {
        const token = getState().user.token;

        const response = await axios.post(`/posts/${postId}/comments`, {
            comment: commentText
        }, {
            headers: {
              //  'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

        });

        dispatch(addComment({ postId, comment: response.data.comment }));
        return {
            success: true,
            comment: response.data.comment,
            postId: postId
        };

    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Ошибка добавления комментария';
        return {
            success: false,
            error: errorMsg
        };
    }
};

export const deleteComment = (postId, commentId) => async (dispatch, getState) => {
    try {
        const token = getState().user.token;

        const response = await axios.delete(`/comments/${commentId}`, {
            headers: {
            //    'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });


        if (response.data.success) {
            dispatch(removeComment({ postId, commentId }));
            return { success: true };
        } else {

            return {
                success: false,
                error: response.data.error || 'Ошибка удаления комментария'
            };
        }

    } catch (error) {
        console.error('Ошибка при удалении комментария:', error);


        const errorMsg = error.response?.data?.error ||
                        error.response?.data?.message ||
                        error.message ||
                        'Ошибка удаления комментария';

        return { success: false, error: errorMsg };
    }
};

const PostPersistConfig = {
    key: 'post',
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ['posts', 'comments' ],
    blacklist: ['postsLoading']
};

export const persistedPostReducer = persistReducer(PostPersistConfig, PostSlice.reducer);

export const {
    setComments,
    addComment,
    removeComment,
    setCommentsLoading,
    setCommentsError,
    clearComments,
    setPosts,
    clearPosts,
    setPostsLoading,
    setPostsError,
} = PostSlice.actions;

export default PostSlice.reducer;
