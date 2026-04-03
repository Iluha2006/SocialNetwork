import { createApi } from '@reduxjs/toolkit/query/react';
import {  removeConversation } from '../../store/ChatMessengers/chatSlice';
import { baseQueryWithCsrf } from '../configAuth';

export const chatsApi = createApi({
    reducerPath: 'chatsApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['Chats'],
    endpoints: (build) => ({

        fetchChatList: build.query({
            query: () => '/messages/mess-chats',
            providesTags: (result) =>
                result
                    ? [
                        { type: 'Chats', id: 'LIST' },
                        ...result.map(({ id }) => ({ type: 'Chats', id }))
                      ]
                    : [{ type: 'Chats', id: 'LIST' }],
        }),

        deleteChat: build.mutation({
            query: (otherUserId) => ({
                url: `/messages/chat/${otherUserId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, otherUserId ) => result? [{ type: 'Chats', id: otherUserId }]: [{ type:'Chats',id:'LIST'}],
            async onQueryStarted(otherUserId, { dispatch, getState }) {
                try {
                    const state = getState();
                    const currentUserId = state.user?.user?.id;
                    const conversationKey = [currentUserId, otherUserId].sort().join('-');

                    await queryFulfilled;
                    dispatch(removeConversation(conversationKey));
                } catch (err) {
                    console.error('Failed to delete chat:', err);
                }
            },
        }),
    })
})

export const {
    useFetchChatListQuery,
    useDeleteChatMutation
} = chatsApi;

export default chatsApi;