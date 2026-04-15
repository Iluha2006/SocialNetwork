import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SettingNavigate = () => {
    const navigate = useNavigate();
    const settings = [
        {
            id: 1,
            to: "/personal",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                </svg>
            ),
            title: "Личная информация",
            description: "Имя, о себе",
            color: "blue"
        },
        {
            id: 2,
            to: "/contacts",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                </svg>
            ),
            title: "Контакты",
            description: "Телефон, Город",
            color: "green"
        },
        {
            id: 3,
            to: "/carer-profile",
            icon: "💼",
            title: "Опыт работы",
            description: "Места работы и должности",
            color: "amber"
        },
        {
            id: 4,
            to: "/privacy",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-lock" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
                </svg>
            ),
            title: "Приватность",
            description: "Приватность профиля",
            color: "red"
        },
        {
            id: 5,
            to: "/blocked-users",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-lock" viewBox="0 0 16 16">
                    <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 5.996V14H3s-1 0-1-1 1-4 6-4q.845.002 1.544.107a4.5 4.5 0 0 0-.803.918A11 11 0 0 0 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664zM9 13a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1"/>
                </svg>
            ),
            title: "Черный список",
            description: "Управление заблокированными пользователями",
            color: "red"
        }
    ];

    const colorClasses = {
        blue: "text-blue-400 group-hover:text-blue-300 hover:border-blue-400",
        green: "text-green-400 group-hover:text-green-300 hover:border-green-400",
        amber: "text-amber-400 group-hover:text-amber-300 hover:border-amber-400",
        red: "text-red-400 group-hover:text-red-300 hover:border-red-400",
        pink: "text-pink-400 group-hover:text-pink-300 hover:border-pink-400"
    };

    const arrowColorClasses = {
        blue: "group-hover:text-blue-400",
        green: "group-hover:text-green-400",
        amber: "group-hover:text-amber-400",
        red: "group-hover:text-red-400",
        pink: "group-hover:text-pink-400"
    };

    return (
        <div className="
    w-full
    max-w-96
    md:max-w-lg
    lg:max-w-2xl
    xl:max-w-3xl
    2xl:max-w-4xl
    mx-auto
    p-4
    sm:p-6
    md:p-8
    rounded-2xl
    md:rounded-3xl
    bg-[rgba(1,14,24,0.946)]
    min-h-screen
    my-4
    md:my-8
">
            <button
                className="
                    mb-6
                    px-4
                    py-2
                    bg-white/10
                    hover:bg-white/20
                    backdrop-blur-sm
                    text-white
                    rounded-xl
                    transition-all
                    duration-200
                    flex
                    items-center
                    gap-2
                    hover:gap-3
                    active:scale-95
                "
                onClick={() => navigate(-1)}
            >
                ← Назад
            </button>

            <div className="text-center mb-10 md:mb-12">
                <h1 className="
                    text-3xl
                    md:text-4xl
                    font-light
                    text-white
                    mb-3
                    tracking-tight
                ">
                    Настройки профиля
                </h1>
                <p className="
                    text-white/80
                    text-base
                    md:text-lg
                    max-w-md
                    mx-auto
                ">
                    Управление вашей личной информацией
                </p>
            </div>

            <div className="
                flex
                flex-col
                gap-4
                md:gap-6
                max-w-2xl
                mx-auto
            ">
                {settings.map((setting) => (
                    <Link
                        key={setting.id}
                        to={setting.to}
                        className={`
                            group
                            flex
                            items-center
                            w-full
                            bg-white/5
                            backdrop-blur-sm
                            p-5
                            md:p-6
                            rounded-xl
                            md:rounded-2xl
                            text-white
                            no-underline
                            transition-all
                            duration-300
                            hover:scale-[1.01]
                            hover:shadow-2xl
                            hover:shadow-blue-500/10
                            border
                            border-white/10
                            hover:border-white/20
                            active:scale-[0.99]
                        `}
                    >
                        <div className={`
                            mr-4
                            md:mr-6
                            transition-colors
                            ${colorClasses[setting.color]}
                        `}>
                            {typeof setting.icon === 'string' ? (
                                <span className="text-3xl md:text-4xl">{setting.icon}</span>
                            ) : (
                                React.cloneElement(setting.icon, {
                                    className: `${setting.icon.props.className || ''} w-8 h-8 md:w-10 md:h-10`
                                })
                            )}
                        </div>

                        <div className="flex-grow">
                            <h3 className="
                                font-semibold
                                text-lg
                                md:text-xl
                                mb-2
                                text-white
                                group-hover:text-white/90
                            ">
                                {setting.title}
                            </h3>
                            <p className="
                                text-sm
                                md:text-base
                                text-white/70
                                group-hover:text-white/80
                            ">
                                {setting.description}
                            </p>
                        </div>

                        <div className={`
                            ml-2
                            md:ml-4
                            text-white/40
                            text-2xl
                            md:text-3xl
                            font-bold
                            transition-all
                            duration-300
                            group-hover:translate-x-2
                            ${arrowColorClasses[setting.color]}
                        `}>
                            →
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SettingNavigate;