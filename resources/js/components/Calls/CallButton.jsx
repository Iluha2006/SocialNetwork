import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initiateCall } from '../../store/Call/CallStore';
import { useOfferCall } from '../../hooks/Calls/useOfferCall';
import './CallButton.css';

const CallButton = ({ userId, userName, callType = 'audio' }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const [isCalling, setIsCalling] = useState(false);

    const { startCall, cleanup: cleanupOffer } = useOfferCall();

    const handleCall = async () => {
        if (!user?.id || !userId) {
            alert('Пользователь не авторизован');
            return;
        }

        setIsCalling(true);
        try {

            const { success, offer, receiverId } = await startCall(userId);

            if (!success || !offer) {
                throw new Error('Не удалось создать WebRTC offer');
            }

            // 2️⃣ Отправляем метаданные звонка через REST
            const result = await dispatch(initiateCall({
                receiver_id: parseInt(receiverId),
                call_type: callType,
                caller_id: user.id,
                receiver_name: userName,
                sdp_offer: offer
            }));

            // 3️⃣ Переход на страницу звонка
            if (result.payload?.call_id) {
                navigate(`/call/${result.payload.call_id}`);
            } else if (result.payload?.existing_call_id) {
                navigate(`/call/${result.payload.existing_call_id}`);
            } else {
                throw new Error(result.payload?.error || 'Ошибка создания звонка');
            }

        } catch (error) {
            console.error('💥 Call initiation error:', error);
            alert('Ошибка: ' + error.message);
            cleanupOffer();
        } finally {
            setIsCalling(false);
        }
    };

    return (
        <button
            onClick={handleCall}
            disabled={isCalling}
            className="call-button"
            aria-label={`Позвонить ${userName}`}
        >
            {isCalling ? 'Вызов...' :  'Позвонить'}
        </button>
    );
};

export default CallButton;