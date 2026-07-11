import React, { useState } from 'react';
import SendButton from '../../UI/Button/SendMessage/SendMessageButton';
import AttachmentPreview from './AttachmentPreview';
import { useMessageSender } from '../../hooks/Message/useMessageSender';
import ImagesUpload from '../../components/Profiles/ImagesProfile/ImageUpload';
import FileUpload from '../../components/ChatFile/FileUpload';
import AudioMessage from '../../components/AudioMessageChat/AudioMessage';
import ImageChat from '../../components/ThemeChat/ImageChat';
import ImageMessage from '../../components/Message/ChatMessage/ImageChat';

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
            <div className="input-area flex items-center justify-center p-4 border-t rounded-b-xl"
                style={{
                    borderColor: 'var(--chat-border, #dee2e6)',
                    background: 'var(--chat-message-bg, #f9fafb)',
                    color: 'var(--chat-text, #6b7280)'
                }}
            >
                <div className="flex items-center gap-2">
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
        <div className="input-area flex flex-col rounded-b-xl"
            style={{
                borderColor: 'var(--chat-border, #dee2e6)',
                background: 'var(--chat-message-bg, #ffffff)'
            }}
        >
          
            <div className="px-3 pt-2 relative">
                <AttachmentPreview
                    image={selectedImage}
                    file={selectedFile}
                    onRemoveImage={() => setSelectedImage(null)}
                    onRemoveFile={() => setSelectedFile(null)}
                />
            </div>
            
          
            <div className="flex items-center p-3 gap-2 relative">
                <div className="flex items-center gap-1 shrink-0">

                     <ImageMessage
                        onImageSelect={setSelectedImage} 
                        disabled={isSending || disabled} 
                    />
                    <FileUpload
                        onFileSelect={setSelectedFile}
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
                        className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        style={{
                            background: 'var(--chat-input-bg, #f3f4f6)',
                            borderColor: 'var(--chat-border, #d1d5db)',
                            color: 'var(--chat-text, #111827)',
                        }}
                        disabled={isSending || disabled}
                        aria-label="Введите сообщение"
                    />
                    {error && (
                        <div className="absolute -top-8 left-0 right-0 text-xs text-red-500 text-center py-1 rounded"
                            style={{ background: 'var(--chat-input-bg, #fef2f2)' }}
                        >
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
        </div>
    );
};

export default MessageInput;