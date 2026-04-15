import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../configAuth';
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


            async onQueryStarted({ receiverId, content, image, file, senderId }, { dispatch, queryFulfilled }) {


                const tempId = `opt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
                const timestamp = Date.now() / 1000;

                const patchResult = dispatch(
                    messagesApi.util.updateQueryData('loadConversationMessages', receiverId, (draft) => {

                        draft.push({
                            id: tempId,
                            sender_id: senderId,
                            receiver_id: receiverId,
                            content: content || '',
                            images: image ? [image] : null,
                            file: file || null,
                            created_at: new Date(timestamp * 1000).toISOString(),

                        });
                    })
                );

                try {

                    const { data } = await queryFulfilled;


                    if (data?.success && data?.data) {
                        const realMessage = data.data;

                        if (index !== -1) {

                            draft[index] = {
                                ...realMessage,

                            };
                        } else {

                            draft.push({
                                ...realMessage,
                                is_optimistic: false,
                                status: 'sent'
                            });
                        }
                    }
                } catch (err) {

                    patchResult.undo();
                    console.error('Failed to send message:', err);
                }
            },

                 invalidatesTags: (result, error, { receiverId }) => [
                { type: 'Chats', id: receiverId },
                { type: 'Messages', id: 'LIST' }
            ],
        }),


        deleteMessage: build.mutation({
            query: (messageId) => ({
                url: `/messages/${messageId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, messageId) =>
                result ? [{ type: 'Messages', id: messageId }] : [{ type: 'Messages', id: 'LIST' }],


            async onQueryStarted(messageId, { dispatch, queryFulfilled }) {

                const patchResult = dispatch(
                    messagesApi.util.updateQueryData('loadConversationMessages', conversationKey, (draft) => {
                        return draft.filter(m => m.id !== messageId);
                    })
                );

                try {
                    await queryFulfilled;

                } catch (err) {
                    patchResult.undo();
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

                dispatch(editMessage({
                    messageId,
                    content,

                }));

                try {
                    await queryFulfilled;

                    dispatch(editMessage({
                        messageId,
                        content,

                    }));
                } catch (err) {

                    dispatch(editMessage({
                        messageId,
                        content,
                        error: 'Не удалось сохранить. Попробуйте ещё раз.'
                    }));
                    console.error('Failed to edit message:', err);
                }
            },
        }),
    })
});

export const {
    useSendMessageMutation,
    useDeleteMessageMutation,
    useEditMessageMutation
} = messagesApi;

export default messagesApi;