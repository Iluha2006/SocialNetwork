import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, delMessage } from '../../../store/UserStore';
import { getEcho } from '../../../echo';

const useWebSocket = (otherUserId = null) => {
    const dispatch = useDispatch();
    const { user, token } = useSelector(state => state.user);

    const setupWebSocket = useCallback(() => {

        const echo = getEcho();

        const channelName = `chat.${user.id}`;
            const channel = echo.private(channelName);


            channel.listen('.private-message', (event) => {

                const isRelevantMessage =
                    (event.message.sender_id === parseInt(otherUserId) && event.message.receiver_id === user.id) ||
                    (event.message.receiver_id === parseInt(otherUserId) && event.message.sender_id === user.id);

                if (isRelevantMessage) {

                    dispatch(
                        addMessage({
                            id: event.message.id,
                            senderId: event.message.sender_id,
                            receiverId: event.message.receiver_id,
                            content: event.message.content,
                            images: event.message.images,
                            file: event.message.file,
                            timestamp: new Date(event.message.created_at).getTime() / 1000,
                        })
                    );
                }
            });


            channel.listen('.message-deleted', (event) => {
                if (otherUserId) {

                    dispatch(delMessage(event.message_id));
                } else {

                    dispatch(delMessage(event.message_id));
                }
            });


            return () => {

                channel.stopListening('.private-message');
                channel.stopListening('.message-deleted');
                channel.stopListening('.audio-message-deleted');
                channel.stopListening('.message-edited');
                window.Echo.leave(channelName);
            };


    }, [user?.id, token, otherUserId, dispatch]);


    useEffect(() => {

        setupWebSocket();
    }, [setupWebSocket]);


    const sendEvent = useCallback((eventName, data) => {
        console.log(' WebSocket: отправка события', eventName, data);
    }, []);

    return { sendEvent };
};

export default useWebSocket;