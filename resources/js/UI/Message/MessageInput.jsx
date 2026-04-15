
import React, { useState } from 'react';

import SendButton from '../../UI/Button/SendMessage/SendMessageButton';
import AttachmentPreview from './AttachmentPreview';
import { useMessageSender } from '../../hooks/Message/useMessageSender';

import ImagesUpload from '../../components/Profiles/ImagesProfile/ImageUpload';
import FileUpload from '../../components/ChatFile/FileUpload';

import AudioMessage from '../../components/AudioMessageChat/AudioMessage';

const MessageInput = ({
    receiverId,
    currentUserId,
    canSend = true,
    onAudioSendComplete,
    disabled = false,
}) => {
    const [message, setMessage] = useState('');

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const { send, isSending, error, clearError } = useMessageSender(
        receiverId,
        () => {
            setMessage('');
            setSelectedImage(null);
            setSelectedFile(null);
            clearError();
        }
    );

    const handleSend = async () => {
        if (!canSend) return;

        await send({
            content: message,
            image: selectedImage,
            file: selectedFile,
            senderId: currentUserId,
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const hasContent = message.trim() || selectedImage || selectedFile;
    if (!canSend) {
        return (
            <div className="input-area flex items-center justify-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm">
                        Отправка сообщений ограничена
                    </span>
                </div>
            </div>
        );
    }
    return (
        <div className="input-area flex items-center p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-2 relative">


            <AttachmentPreview
                image={selectedImage}
                file={selectedFile}
                onRemoveImage={() => setSelectedImage(null)}
                onRemoveFile={() => setSelectedFile(null)}
            />


            <div className="flex items-center gap-1 flex-shrink-0">

                <ImagesUpload />
                <FileUpload
                    onFileSelect={setSelectedFile}
                    disabled={isSending || disabled}
                />
                <AudioMessage
                    receiverId={parseInt(receiverId)}
                    compact={false}
                    onSendComplete={onAudioSendComplete}
                    disabled={isSending || disabled}
                />
            </div>
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        if (error) clearError();
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите сообщение..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    disabled={isSending || disabled}
                    aria-label="Введите сообщение"
                />
                {error && (
                    <div className="absolute -top-8 left-0 right-0 text-xs text-red-500 text-center bg-red-50 dark:bg-red-900/20 py-1 rounded">
                        {error}
                    </div>
                )}
            </div>

            <SendButton
                onClick={handleSend}
                disabled={disabled}
                isSending={isSending}
                hasContent={!!hasContent}
            />
        </div>
    );
};



export default MessageInput;