import { useCallback, useState } from 'react';
import { useSendMessageMutation } from '../../api/modules/messages';

export const useMessageSender = (receiverId, onSuccess) => {
    const [sendMessageMutation] = useSendMessageMutation();
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);

    const send = useCallback(async ({ content, image, file, senderId }) => {
        if (!receiverId || (!content?.trim() && !image && !file)) {
            return ;
        }

        setIsSending(true);
        setError(null);

        try {

            const result = await sendMessageMutation({
                receiverId: parseInt(receiverId),
                content: content?.trim() || '',
                image,
                file,
                senderId,
            }).unwrap();


            if (result?.success !== false) {
                onSuccess?.(result);
                return { success: true,  result };
            }

            return { success: false, error: result?.message || 'Ошибка отправки' };

        } catch (err) {
            const errorMessage = err?.data?.message || err?.message || 'Не удалось отправить сообщение';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsSending(false);
        }
    }, [receiverId, sendMessageMutation, onSuccess]);

    return {
        send,
        isSending,
        error,
        clearError: () => setError(null),
    };
};