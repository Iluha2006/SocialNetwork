import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnlineUsers, setUserOnline, setUserOffline, addOnlineUser, removeOnlineUser } from '../../store/OnlineUser/OnlineUsers';

const OnlineUser = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    if (!user?.id) return;

    dispatch(setUserOnline());
    dispatch(fetchOnlineUsers());

    let echoChannel = null;

    const setupWebSocket = () => {
      try {
        if (!window.Echo) {
          console.warn('Echo not initialized');
          return;
        }

        echoChannel = window.Echo.channel('online-users')
          .listen('.user.status.updated', (data) => {
            if (data?.user?.online_status === 'online') {
              dispatch(addOnlineUser(data.user));
            } else if (data?.user?.id) {
              dispatch(removeOnlineUser(data.user.id));
            }
          });
      } catch (error) {
        console.warn('WebSocket connection failed:', error);
      }
    };

    setupWebSocket();

    const interval = setInterval(() => {
      dispatch(fetchOnlineUsers());
    }, 30000);

    return () => {
      clearInterval(interval);
      dispatch(setUserOffline());

      if (echoChannel) {
        window.Echo.leaveChannel('online-users');
      }
    };
  }, [dispatch, user?.id]);

  return null;
};

export default OnlineUser;
