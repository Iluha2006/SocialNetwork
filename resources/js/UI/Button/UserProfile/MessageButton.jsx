// components/Profile/MessageButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const MessageButton = ({ recipientId, recipientName, disabled = false, className = '' }) => {
    const navigate = useNavigate();

    const handleMessage = () => {
        if (recipientId) {
            navigate(`/messages/${recipientId}`);
        }
    };

    return (
        <button
            onClick={handleMessage}
            disabled={disabled}
            className={`
                px-5 py-2.5
                bg-gray-200 text-gray-700
                border-none rounded-lg
                text-sm font-medium
                cursor-pointer transition-all
                min-w-40 hover:bg-gray-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
            title={`Написать сообщение ${recipientName || ''}`}
        >
            Сообщение
        </button>
    );
};



export default MessageButton;