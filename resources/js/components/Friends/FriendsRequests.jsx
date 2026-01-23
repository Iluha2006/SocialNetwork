import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFriendRequests } from '../../store/FriendList';
import IncomingRequests from './IncomingRequests';
import OutgoingRequests from './OutgoingRequest'

const FriendsRequests = () => {
    const dispatch = useDispatch();
    const { user, token } = useSelector(state => state.user);
    const { friendsLoading } = useSelector(state => state.friends);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchFriendRequests(user.id));
        }
    }, [dispatch, user?.id]);

    const totalRequests = useSelector(state =>
        state.friends.incomingRequests.length +
        state.friends.outgoingRequests.length
    );

    if (friendsLoading) return <div className="loading">Загрузка заявок...</div>;

    return (
        <div
            className="w-full max-w-4xl mx-auto p-5  from-blue-500 rounded-2xl min-h-screen"
            style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}
        >

            <div className="flex items-center justify-between mb-8 bg-white p-5 rounded-xl shadow-lg">
                <h2 className="flex items-center gap-2 m-0 text-2xl font-semibold text-gray-800">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        fill="currentColor"
                        className="bi bi-envelope text-blue-500"
                        viewBox="0 0 16 16"
                    >
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                    </svg>
                    Заявки в друзья
                </h2>
                {totalRequests > 0 && (
                    <span className=" from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm">
                        {totalRequests}
                    </span>
                )}
            </div>


            <IncomingRequests />
            <OutgoingRequests />


            {totalRequests === 0 && (
                <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                    <p className="text-xl text-gray-800 font-medium mb-2">
                        Пока нет заявок в друзья
                    </p>
                    <p className="text-gray-500">
                        Когда кто-то отправит вам заявку в друзья, она появится здесь
                    </p>
                </div>
            )}
        </div>
    );
};

export default FriendsRequests;
