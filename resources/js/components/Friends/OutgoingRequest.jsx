import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { rejectFriendRequest } from '../../store/FriendList';

const OutgoingRequests = () => {
    const dispatch = useDispatch();
    const { outgoingRequests } = useSelector(state => state.friends);

    const handleCancel = (requestId) => {
        dispatch(rejectFriendRequest(requestId));
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
                                    src={request.receiver?.avatar || request.receiver_avatar || 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'}
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