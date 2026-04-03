// components/Profile/BlockButton.jsx
import React from 'react';
import PropTypes from 'prop-types';

const BlockButton = ({
    isBlocked = false,
    disabled = false,
    onClick,
    className = ''
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                px-5 py-2.5 border-none rounded-lg text-sm font-medium
                cursor-pointer transition-all min-w-40
                disabled:opacity-60 disabled:cursor-not-allowed
                ${isBlocked
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-500 hover:bg-gray-600 text-white'}
                ${className}
            `}
            title={isBlocked ? 'Разблокировать пользователя' : 'Заблокировать пользователя'}
        >
            {isBlocked ? 'Разблокировать' : 'Заблокировать'}
        </button>
    );
};

BlockButton.propTypes = {
    isBlocked: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
};

export default BlockButton;