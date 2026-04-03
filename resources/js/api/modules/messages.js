import { baseQueryWithCsrf } from '../configAuth';
import { createApi } from '@reduxjs/toolkit/query/react';
import { addMessage, editMessage, removeMessage } from '../../store/ChatMessengers/chatSlice';
export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['Messages', 'Chats'],
    endpoints: (build) => ({

        sendMessage: build.mutation({
            query: (messageData) => {
                const formData = new FormData();
                formData.append('receiver_id', messageData.receiverId);
                formData.append('content', messageData.content || '');
                if (messageData.image) formData.append('image_mess', messageData.image);
                if (messageData.file) formData.append('file', messageData.file);

                return {
                    url: `/messages/send/${messageData.receiverId}`,
                    method: 'POST',
                    body: formData,

                };
            },
            invalidatesTags: (result, error, messageData) => [
                { type: 'Chats', id: messageData.receiverId },
                { type: 'Messages', id: 'LIST' }
            ],
                        async onQueryStarted({ receiverId }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.success && data?.data) {
                        const message = data.data;
                        dispatch(addMessage({
                            id: message.id,
                            senderId: message.sender_id,
                            receiverId: message.receiver_id,
                            content: message.content,
                            images: message.images,
                            file: message.file,
                            timestamp: new Date(message.created_at).getTime() / 1000
                        }));
                        const { getEcho } = await import('../../echo');
                        getEcho();
                    }
                } catch (err) {
                    console.error('Failed to send message:', err);
                }
            },
        }),

        deleteMessage: build.mutation({
            query: (messageId) => ({
                url: `/messages/${messageId}`,
                method: 'DELETE',
            }),

            invalidatesTags: (result, error, messagesId) => result ? [{ type: 'Messages', id: messagesId }]
            :{ type: 'Messages', id: 'LIST' },
            async onQueryStarted(messageId, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.success) {
                        dispatch(removeMessage(messageId));
                    }
                } catch (err) {
                    console.error('Failed to delete message:', err);
                }
            },
        }),

        editMessage: build.mutation({
            query: ({ messageId, content }) => ({
                url: `/messages/chat/${messageId}`,
                method: 'PUT',
                body: { content },
            }),
            invalidatesTags: (result, error, { messageId }) => [
                { type: 'Messages', id: messageId }
            ],
            async onQueryStarted({ messageId, content }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(editMessage({ messageId, content }));
                } catch (err) {
                    console.error('Failed to edit message:', err);
                }
            },
        }),
    }),
});

export const {
    useSendMessageMutation,
    useDeleteMessageMutation,
    useEditMessageMutation
} = messagesApi;

export default messagesApi;