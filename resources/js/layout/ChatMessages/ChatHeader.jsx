
import React from 'react';
import Modal from '../../components/ModalChat/Modal';
import CallButton from '../../components/Calls/CallButton';

const ChatHeader = ({
    recipient,
    isOnline,
    isBlocked,
    onProfileClick,
}) => {
    return (
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl gap-3 text-amber-50 bg-white/5 backdrop-blur-sm">

            <Modal otherUserId={recipient?.id} />
            <CallButton userId={recipient?.id} userName={recipient?.name} />


            {recipient && (
                <div
                    className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => !isBlocked && onProfileClick?.()}
                    role="button"
                    onKeyDown={(e) => !isBlocked && e.key === 'Enter' && onProfileClick?.()}
                >
                    <div className="relative">
                        <img
                            src={recipient.avatar || 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13'}
                            alt={recipient.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                            onError={(e) => {
                                e.target.src = 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13';
                            }}
                        />

                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                            isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <h3 className="font-semibold text-white truncate">{recipient.name}</h3>
                        <span className={`text-xs ${
                            isBlocked ? 'text-red-400' : isOnline ? 'text-green-400' : 'text-gray-400'
                        }`}>
                            {isBlocked ? 'Доступ ограничен' : isOnline ? 'В сети' : 'Не в сети'}
                        </span>
                    </div>
                </div>
            )}

            {isBlocked && (
                <div className="ml-auto flex items-center gap-2 text-red-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Заблокировано</span>
                </div>
            )}
        </div>
    );
};



export default ChatHeader;