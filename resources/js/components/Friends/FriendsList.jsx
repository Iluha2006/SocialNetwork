import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


import { fetchFriends, deleteFriend } from '../../store/Friends/FriendList';


const FriendsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const { friends, friendsLoading} = useSelector ( state=>state.friends)

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchFriends(user.id));
        }
    }, [dispatch, user?.id]);

    const handleRemoveFriend = async (friendId, friendName) => {
        if (window.confirm(`Вы уверены, что хотите удалить ${friendName} из друзей?`)) {
            const result = await dispatch(deleteFriend(user.id, friendId));
            if (result.success) {
                alert(`${friendName} удален из друзей`);
            }
        }
    };


    const handleMessage = (friendId) => {
        navigate(`/messages/${friendId}`);
    };

    const handleViewProfile = (friendId) => {
        navigate(`/profile/${friendId}`);
    };


    if (friendsLoading) return <div className="loading">Загрузка списка друзей...</div>;

    return(

        <div className="w-full max-w-6xl mx-auto p-5 from-blue-500  rounded-2xl min-h-screen"  style={{ backgroundColor: 'rgba(1, 14, 24, 0.946)' }}>

                <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="flex items-center gap-3 m-0 text-3xl font-bold text-gray-800">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="45"
                            height="45"
                            fill="currentColor"
                            className="bi bi-person text-blue-500"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                        </svg>
                        Мои друзья
                    </h2>
                </div>

                {friends.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                        <div className="text-gray-400 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="45"
                                height="45"
                                fill="currentColor"
                                className="bi bi-person mx-auto opacity-70"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Пока нет друзей</h3>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                            Добавляйте друзей, чтобы общаться и делиться новостями
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {friends.map((friend, index) => (
                            <div
                                key={friend.id}
                                className=" bg-amber-50 rounded-2xl p-6 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div
                                    className="flex items-center mb-5 cursor-pointer"
                                    onClick={() => handleViewProfile(friend.user_id || friend.id)}
                                >
                                    <div className="relative mr-4">
                                        <img
                                            src={friend.avatar || 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'}
                                            alt={friend.name}
                                            className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 shadow-md transition-all hover:border-blue-500"
                                            onError={(e) => {
                                                e.target.src = 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13';
                                            }}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-1 transition-colors hover:text-blue-600">
                                            {friend.name}
                                        </h3>
                                        {friend.user && (
                                            <p className="text-gray-500 text-sm">@{friend.user.name}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end  pt-4 mt-auto">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMessage(friend.user_id || friend.id);
                                        }}
                                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all hover:scale-110"
                                        title="Написать сообщение"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                                        </svg>
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all hover:scale-110"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveFriend(friend.user_id || friend.id, friend.name);
                                        }}
                                        title="Удалить из друзей"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
    )



};

export default FriendsList;
