import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { acceptFriendRequest, rejectFriendRequest } from '../../store/Friends/FriendList';

const IncomingRequests = () => {
    const dispatch = useDispatch();
    const { incomingRequests } = useSelector(state => state.friends);

    const handleAccept = (requestId) => {
        dispatch(acceptFriendRequest(requestId));
    };

    const handleReject = (requestId) => {
        dispatch(rejectFriendRequest(requestId));
    };

    if (incomingRequests.length === 0) return null;

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Входящие заявки</h3>
            <div className="grid gap-5">
                {incomingRequests.map(request => (
                    <div
                        key={request.id}
                        className="bg-white rounded-xl p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="flex items-center mb-5">
                            <div className="relative mr-5">
                                <img
                                    src={request.sender?.avatar || request.sender_avatar || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E'}
                                    alt={request.sender?.name || request.sender_name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-black mb-1">
                                    {request.sender?.name || request.sender_name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    Хочет добавить вас в друзья
                                </p>
                                <div className="flex gap-4">
                                    <span className="text-gray-500 text-xs">
                                        {new Date(request.created_at).toLocaleDateString('ru-RU')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                className="flex items-center gap-2 from-green-500 to-teal-500 text-black px-5 py-2.5 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all hover:-translate-y-0.5"
                                onClick={() => handleAccept(request.id)}
                                title="Принять заявку"
                            >
                                <span className="text-green-700">✓</span>
                                Принять
                            </button>
                            <button
                                className="flex items-center gap-2  from-red-500 to-pink-500 text-black px-5 py-2.5 rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all hover:-translate-y-0.5"
                                onClick={() => handleReject(request.id)}
                                title="Отклонить заявку"
                            >
                                <span className="text-red-500">✕</span>
                                Отклонить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncomingRequests;