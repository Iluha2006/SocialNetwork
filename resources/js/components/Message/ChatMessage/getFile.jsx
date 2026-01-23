import React from 'react';

const getFileIcon = (fileName) => {
    if (!fileName) return "📎";

    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
        case "pdf":
            return (
                <img
                    width="40"
                    height="40"
                    src="https://avatars.mds.yandex.net/i?id=dce9f320cfc5621bd3d680c2c9bc5cdd155f59b0-2479991-images-thumbs&n=13"
                    alt="PDF иконка"
                />
            );
        case "doc":
        case "docx":
            return (
                <img
                    width="40"
                    height="40"
                    src="https://logos-world.net/wp-content/uploads/2020/03/Microsoft-Word-Logo-2013-2019.png"
                    alt="Word иконка"
                />
            );
        case "txt":
            return "📃";
        case "zip":
        case "rar":
            return (
                <img
                    width="40"
                    height="40"
                    src="https://commeng.ru/catalog/step-img/4380843.png"
                    alt="Архив иконка"
                />
            );
        case "xls":
        case "xlsx":
            return (
                <img
                    width="40"
                    height="40"
                    src="https://avatars.mds.yandex.net/i?id=1b76e7c9f46fe80899d1b4822fa6b72eff459dab-10122172-images-thumbs&n=13"
                    alt="Excel иконка"
                />
            );
        case "ppt":
        case "pptx":
            return (
                <img
                    width="40"
                    height="40"
                    src="https://avatars.mds.yandex.net/i?id=f6d597408380a4d59ff4da4c7b651d58236db821-10349474-images-thumbs&n=13"
                    alt="PowerPoint иконка"
                />
            );
        default:
            return "📎";
    }
};

export default getFileIcon;