
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { messagesApi} from '../../api/modules/messages'
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
            const isRelevant =
                (event.message.sender_id === parseInt(otherUserId) && event.message.receiver_id === user.id) ||
                (event.message.receiver_id === parseInt(otherUserId) && event.message.sender_id === user.id);

            if (isRelevant) {

                dispatch(
                    messagesApi.util.updateQueryData('loadConversationMessages', otherUserId, (draft) => {

                        if (!draft.some(m => m.id === event.message.id)) {
                            draft.push({
                                ...event.message,
                                is_optimistic: false,
                                status: 'sent'
                            });
                        }
                    })
                );
            }
        });


        channel.listen('.message-deleted', (event) => {
            dispatch(
                messagesApi.util.updateQueryData('loadConversationMessages', otherUserId, (draft) => {
                    return draft.filter(m => m.id !== event.message_id);
                })
            );
        });


        channel.listen('.message-edited', (event) => {
            dispatch(
                messagesApi.util.updateQueryData('loadConversationMessages', otherUserId, (draft) => {
                    const msg = draft.find(m => m.id === event.message_id);
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