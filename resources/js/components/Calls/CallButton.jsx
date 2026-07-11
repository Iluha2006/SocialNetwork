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

    const { startCall } = useOfferCall();

    const handleCall = async () => {
        if (!user?.id || !userId) {
            alert('Пользователь не авторизован');
            return;
        }

        setIsCalling(true);
        let cleanup = null;
        try {
            const result = await startCall(userId);
            cleanup = result.cleanup;

            if (!result.success || !result.offer) {
                throw new Error('Не удалось создать WebRTC offer');
            }
            const result2 = await dispatch(initiateCall({
                receiver_id: parseInt(userId),
                call_type: callType,
                caller_id: user.id,
                receiver_name: userName,
                sdp_offer: result.offer
            }));

            if (result2.payload?.call_id) {
                navigate(`/call/${result2.payload.call_id}`);
            } else if (result2.payload?.existing_call_id) {
                navigate(`/call/${result2.payload.existing_call_id}`);
            } else {
                throw new Error(result2.payload?.error || 'Ошибка создания звонка');
            }

        } catch (error) {
            console.error('💥 Call initiation error:', error);
            alert('Ошибка: ' + error.message);
            cleanup?.();
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
            
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
</svg>
        </button>
    );
};

export default CallButton;