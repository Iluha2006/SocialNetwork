import React from 'react';

const ICONS = {
    pdf: 'https://avatars.mds.yandex.net/i?id=dce9f320cfc5621bd3d680c2c9bc5cdd155f59b0-2479991-images-thumbs&n=13',
    doc: 'https://cdn-icons-png.flaticon.com/512/281/281760.png',
    docx: 'https://cdn-icons-png.flaticon.com/512/281/281760.png',
    txt: 'https://cdn-icons-png.flaticon.com/512/136/136769.png',
    zip: 'https://commeng.ru/catalog/step-img/4380843.png',
    rar: 'https://commeng.ru/catalog/step-img/4380843.png',
    xls: 'https://avatars.mds.yandex.net/i?id=1b76e7c9f46fe80899d1b4822fa6b72eff459dab-10122172-images-thumbs&n=13',
    xlsx: 'https://avatars.mds.yandex.net/i?id=1b76e7c9f46fe80899d1b4822fa6b72eff459dab-10122172-images-thumbs&n=13',
    ppt: 'https://avatars.mds.yandex.net/i?id=f6d597408380a4d59ff4da4c7b651d58236db821-10349474-images-thumbs&n=13',
    pptx: 'https://avatars.mds.yandex.net/i?id=f6d597408380a4d59ff4da4c7b651d58236db821-10349474-images-thumbs&n=13',
};

const getFileIcon = (fileName) => {
    if (!fileName) {
        return (
            <img
                width="36"
                height="36"
                src="https://cdn-icons-png.flaticon.com/512/716/716784.png"
                alt="Файл"
            />
        );
    }

    const extension = fileName.split('.').pop().toLowerCase();
    const iconUrl = ICONS[extension];

    if (iconUrl) {
        return (
            <img
                width="36"
                height="36"
                src={iconUrl}
                alt={`${extension.toUpperCase()} иконка`}
            />
        );
    }

    return (
        <img
            width="36"
            height="36"
            src="https://cdn-icons-png.flaticon.com/512/716/716784.png"
            alt="Файл"
        />
    );
};

export default getFileIcon;
