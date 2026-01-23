import React, { useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileSelect, disabled }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {

            if (file.size > 10 * 1024 * 1024) {
                alert('Размер файла не должен превышать 10MB');
                return;
            }
            onFileSelect(file);
        }
    };

    return (
        <div className="file-upload-container">
            <svg
                style={{cursor: 'pointer'}}
                onClick={() => fileInputRef.current.click()}
                disabled={disabled}
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-paperclip"
                viewBox="0 0 16 16"
            >
                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z"/>
            </svg>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt,.zip,.rar,.xls,.xlsx,.ppt,.pptx"
                style={{ display: 'none' }}
                disabled={disabled}
            />
        </div>
    );
};

export default FileUpload;