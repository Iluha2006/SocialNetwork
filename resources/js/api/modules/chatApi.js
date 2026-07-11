import { createApi } from '@reduxjs/toolkit/query/react';
import { removeConversation } from '../../store/ChatMessengers/chatSlice';
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
            invalidatesTags: (result, otherUserId) =>
                result ? [{ type: 'Chats', id: otherUserId }] : [{ type: 'Chats', id: 'LIST' }],
            async onQueryStarted(otherUserId, { dispatch, getState, queryFulfilled }) {
                const state = getState();
                const currentUserId = state.user?.user?.id;
                const conversationKey = [currentUserId, otherUserId].sort().join('-');

                dispatch(removeConversation(conversationKey));

                const patchResult = dispatch(
                    chatsApi.util.updateQueryData('fetchChatList', undefined, (draft) => {
                        const idx = draft.findIndex(chat => chat.id === otherUserId);
                        if (idx !== -1) draft.splice(idx, 1);
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
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