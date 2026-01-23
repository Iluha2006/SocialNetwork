import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchFriends } from '../../store/FriendList';


const FriendProfile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const { profile }=useSelector(state => state.profile);
    const {friends, friendsLoading} =useSelector(state=>state.friends)

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchFriends(user.id));
        }
    }, [dispatch, user?.id]);

    const handleViewAllFriends = () => {
        navigate('/friends');
    };

    const handleViewProfile = (friendId) => {
        navigate(`/profile/${friendId}`);
    };


    const previewFriends = friends.slice(0, 6);
    const totalFriends = friends.length;

    if (friendsLoading) return <div className="friends-preview-loading">Загрузка друзей...</div>;
    return (

        <div className=" rounded-xl p-4 mb-5 shadow-lg"     style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
                <h3 className="flex items-center gap-2 m-0 text-lg font-semibold text-gray-200">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-people-fill text-blue-400"
                        viewBox="0 0 16 16"
                    >
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                    </svg>
                    Друзья
                </h3>
                <span className="text from-gray-300 to-green-300 text-amber-50 px-3 py-1 rounded-full text-sm font-medium">
                    {totalFriends}
                </span>
            </div>

            {totalFriends === 0 ? (
                <div className="text-center py-6">
                    <p className="text-gray-400 m-0">Пока нет друзей</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {previewFriends.map(friend => (
                            <div
                                key={friend.id}
                                className="flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1"
                                onClick={() => handleViewProfile(friend.user_id || friend.id)}
                                title={friend.name}
                            >
                                <img
                                    src={friend.avatar || 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'}
                                    alt={friend.name}
                                    className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-transparent transition-colors hover:border-blue-500"
                                />
                                <span className="text-xs text-gray-200 text-center max-w-20 truncate">
                                    {friend.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {totalFriends > 6 && (
                        <button
                            className="w-full py-2.5 bg-gray-700 border-none rounded-lg text-blue-400 font-medium cursor-pointer transition-colors hover:bg-gray-600"
                            onClick={handleViewAllFriends}
                        >
                            Показать всех друзей ({totalFriends})
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default FriendProfile;
