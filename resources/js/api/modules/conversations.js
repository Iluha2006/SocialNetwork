import { createApi } from '@reduxjs/toolkit/query/react';
import { loadMessages } from '../../store/ChatMessengers/chatSlice';
import { baseQueryWithCsrf } from  '../configAuth';;


export const conversationsApi = createApi({
    reducerPath: 'conversationsApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['Conversation', 'Messages'],

    endpoints: (build) => ({
        loadConversationMessages: build.query({
            query: (otherUserId) => `/messages/conversation/${otherUserId}`,


            providesTags: (result, error, otherUserId) => [
                { type: 'Conversation', id: otherUserId },
                { type: 'Messages', id: 'LIST' }
            ],

            async onQueryStarted({ otherUserId, currentUserId }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    if (Array.isArray(data)) {
                        const conversationKey = [currentUserId, otherUserId].sort().join('-');
                        dispatch(loadMessages({ conversationKey, messages: data }));
                        const { getEcho } = await import('../../echo');
                        getEcho();

                    }
                } catch (err) {
                    console.error('Failed to load conversation:', err);
                }
            },
        }),
    }),
});

export const { useLoadConversationMessagesQuery } = conversationsApi;
export default conversationsApi;