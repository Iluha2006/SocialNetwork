import { createApi } from '@reduxjs/toolkit/query/react';
import { loadMessages } from '../../store/ChatMessengers/chatSlice';
import { baseQueryWithCsrf } from  '../configAuth';;


export const conversationsApi = createApi({
    reducerPath: 'conversationsApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['Conversation'],

    endpoints: (build) => ({
        loadConversationMessages: build.query({
            query: (otherUserId) => `/messages/conversation/${otherUserId}`,


            providesTags: (result, error, otherUserId) => [
                { type: 'Conversation', id: otherUserId },
                { type: 'Conversation', id: 'LIST' }
            ],

            async onQueryStarted(otherUserId, { dispatch, queryFulfilled, getState }) {
                try {
                    const { data } = await queryFulfilled;
                    const currentUserId = getState().user?.user?.id;

                    if (Array.isArray(data) && currentUserId) {
                        const conversationKey = [currentUserId, Number(otherUserId)].sort().join('-');
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