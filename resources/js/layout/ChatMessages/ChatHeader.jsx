
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
        <div className="flex items-center p-4 border-b rounded-t-2xl gap-3"
            style={{
                background: 'var(--chat-header-gradient, linear-gradient(135deg, #007bff 0%, #0056b3 100%))',
                borderColor: 'var(--chat-border, rgba(255,255,255,0.1))'
            }}
        >

            <CallButton userId={recipient?.id} userName={recipient?.name} />
            <Modal otherUserId={recipient?.id} />


            {recipient && (
                <div
                    className="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => !isBlocked && onProfileClick?.()}
                    role="button"
                    onKeyDown={(e) => !isBlocked && e.key === 'Enter' && onProfileClick?.()}
                >
                    <div className="relative">
                        <img
                            src={recipient.avatar || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E'}
                            alt={recipient.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                            onError={(e) => {
                                if (e.target.src === 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E') return;
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%22 y=%2258%22 text-anchor=%22middle%22 font-size=%2240%22 fill=%22%23999%22%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E';
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