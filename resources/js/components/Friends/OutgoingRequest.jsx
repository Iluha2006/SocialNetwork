import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cancelFriendRequest } from '../../store/Friends/FriendList';

const OutgoingRequests = () => {
    const dispatch = useDispatch();
    const { outgoingRequests } = useSelector(state => state.friends);

    const handleCancel = (requestId) => {
        dispatch(cancelFriendRequest(requestId));
    };

    if (outgoingRequests.length === 0) return null;

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Исходящие заявки</h3>
            <div className="grid gap-5">
                {outgoingRequests.map(request => (
                    <div
                        key={request.id}
                        className="bg-gray-800 rounded-xl p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="flex items-center mb-5">
                            <div className="relative mr-5">
                                <img
                                    src={request.receiver?.avatar || request.receiver_avatar || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E'}
                                    alt={request.receiver?.name || request.receiver_name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    {request.receiver?.name || request.receiver_name}
                                </h3>
                                <p className="text-gray-300 text-sm mb-2">
                                    Ожидание подтверждения заявки
                                </p>
                                <div className="flex gap-4">
                                    <span className="text-gray-400 text-xs">
                                        Отправлено: {new Date(request.created_at).toLocaleDateString('ru-RU')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                className="flex items-center gap-2  from-amber-600 to-amber-800 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-amber-700 hover:to-amber-900 transition-all hover:-translate-y-0.5"
                                onClick={() => handleCancel(request.id)}
                                title="Отменить заявку"
                            >

                                Отменить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OutgoingRequests;