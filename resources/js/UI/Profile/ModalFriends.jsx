import React from 'react';
import { normalizeMediaUrl, DEFAULT_AVATAR } from '../../utils/mediaUrl';

const ModalFriends = ({ isOpen, onClose, friends, onViewProfile }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50 p-4"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-[rgba(1,14,24,0.97)] rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700 shrink-0">
                    <h2 className="text-lg font-semibold text-white m-0">
                        Все друзья ({friends.length})
                    </h2>
                    <button
                        className="text-gray-400 hover:text-white hover:bg-gray-700 w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer border-none bg-transparent text-xl"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="overflow-y-auto p-4 flex-1 min-h-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {friends.map(friend => (
                            <div
                                key={friend.id}
                                className="flex flex-col items-center cursor-pointer transition-transform hover:-translate-y-1 p-2 rounded-lg hover:bg-white/5"
                                onClick={() => {
                                    onViewProfile(friend.user_id || friend.id);
                                    onClose();
                                }}
                                title={friend.name}
                            >
                                <img
                                    src={normalizeMediaUrl(friend.avatar) || DEFAULT_AVATAR}
                                    alt={friend.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-2 border-2 border-transparent transition-colors hover:border-blue-500"
                                    onError={(e) => {
                                        if (e.target.src === DEFAULT_AVATAR) return;
                                        e.target.src = DEFAULT_AVATAR;
                                    }}
                                />
                                <span className="text-xs text-gray-200 text-center w-full px-1 break-words">
                                    {friend.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalFriends;
