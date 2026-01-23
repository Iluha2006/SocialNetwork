import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnlineUsers, setUserOnline, setUserOffline, addOnlineUser, removeOnlineUser } from '../../store/OnlineUsers';

const OnlineUser = () => {
  const dispatch = useDispatch();
  const { onlineUsers, loading } = useSelector(state => state.online);

  useEffect(() => {
    console.log('Setting user online...');
    dispatch(setUserOnline());
    dispatch(fetchOnlineUsers());

    const setupWebSocket = () => {
      try {


        window.Echo.channel('online-users')
          .listen('.user.status.updated', (data) => {
            console.log('WebSocket event received:', data);

            if (data.user.online_status) {

              dispatch(addOnlineUser(data.user));
            } else {
              console.log('Removing offline user:', data.user.id);
              dispatch(removeOnlineUser(data.user.id));
            }
          });
      } catch (error) {
        console.warn('WebSocket connection failed:', error);
      }
    };

    setupWebSocket();

    const interval = setInterval(() => {
      console.log('Polling online users...');
      dispatch(fetchOnlineUsers());
    }, 30000);

    return () => {
      console.log('Cleaning up...');
      clearInterval(interval);
      dispatch(setUserOffline());

      if (window.Echo) {
        window.Echo.leaveChannel('online-users');
      }
    };
  }, [dispatch]);



  if (loading) {
    return <div>Loading online users...</div>;
  }

  return (
    <div>
      <h3>Online Users ({onlineUsers.length})</h3>
      <ul>
        {onlineUsers.map(user => (
          <li key={user.id}>
            {user.name} - {user.online_status ? 'Online' : `Last seen: ${new Date(user.last_seen).toLocaleString()}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUser;
