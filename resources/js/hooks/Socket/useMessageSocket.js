
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { conversationsApi } from '../../api/modules/conversations';
import { getEcho } from '../../echo';

const useMessageSocket = (otherUserId = null) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);

    const setupWebSocket = useCallback(() => {
        if (!user?.id || !otherUserId) return;

        const echo = getEcho();
        const ids = [user.id, parseInt(otherUserId)].sort((a, b) => a - b);
        const channelName = `chat.${ids.join('.')}`;
        const channel = echo.private(channelName);

        channel.listen('.private-message', (event) => {
            if (event.sender_id === user.id) return;

            const isRelevant =
                (event.sender_id === parseInt(otherUserId) && event.receiver_id === user.id) ||
                (event.receiver_id === parseInt(otherUserId) && event.sender_id === user.id);

            if (isRelevant) {
                dispatch(
                    conversationsApi.util.updateQueryData('loadConversationMessages', otherUserId, (draft) => {
                        if (!draft.messages.some(m => m.id === event.id)) {
                            draft.messages.push({
                                ...event,
                                is_optimistic: false,
                                status: 'sent'
                            });
                        }
                    })
                );
            }
        });

        channel.listen('.message-deleted', (event) => {
            const deletedId = event.message_id ?? event.id;
            if (!deletedId) return;
            dispatch(
                conversationsApi.util.updateQueryData('loadConversationMessages', otherUserId, (draft) => {
                    draft.messages = draft.messages.filter(m => m.id !== deletedId);
                })
            );
        });

        channel.listen('.message-edited', (event) => {
            dispatch(
                conversationsApi.util.updateQueryData('loadConversationMessages', otherUserId, (draft) => {
                    const msg = draft.messages.find(m => m.id === event.message_id);
                    if (msg) {
                        msg.content = event.new_content;
                        msg.edited = true;
                    }
                })
            );
        });

        return () => {
            channel.stopListening('.private-message');
            channel.stopListening('.message-deleted');
            channel.stopListening('.message-edited');
            echo.leave(channelName);
        };
    }, [user?.id, otherUserId, dispatch]);

    useEffect(() => {
        return setupWebSocket();
    }, [setupWebSocket]);

    return {};
};

export default useMessageSocket;