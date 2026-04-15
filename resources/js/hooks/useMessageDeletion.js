import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteAudioMessage, getConversationAudio } from '../store/Files/AudioMessage';

import { useDeleteMessageMutation } from '../api/modules/messages';

const useMessageDeletion = (userId) => {
    const dispatch = useDispatch();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [deleteMessage] = useDeleteMessageMutation();

    const handleDeleteMessage = useCallback(async (messageId, messageType, senderId, receiverId) => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            let result;

            if (messageType === 'audio') {
                result = await dispatch(deleteAudioMessage(messageId, senderId, receiverId));

                if (result?.success) {

                    dispatch(getConversationAudio(parseInt(userId)));
                }
            } else {
               result = await deleteMessageMutation(messageId);
            }

            if (result?.success) {
                setShowSuccessNotification(true);
                setTimeout(() => setShowSuccessNotification(false), 3000);
                return { success: true };
            } else {
                setDeleteError(result?.error || 'Ошибка при удалении сообщения');
                return { success: false, error: result?.error };
            }
        } catch (error) {
            setDeleteError('Неизвестная ошибка при удалении');
            return { success: false, error: error.message };
        } finally {
            setIsDeleting(false);
        }
    }, [dispatch, userId]);

    return {
        handleDeleteMessage,
        isDeleting,
        deleteError,
        showSuccessNotification,
        setShowSuccessNotification
    };
};

export default useMessageDeletion;