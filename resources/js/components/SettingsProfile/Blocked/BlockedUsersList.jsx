// components/BlockedUsers/BlockedUsersList.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlockedUsers, unblockUser } from '../../../store/Profile';
import { useNavigate } from 'react-router-dom';

const BlockedUsersList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { blockedUsers, blockedUsersLoading, blockedUsersError, profile } = useSelector((state) => state.profile);
    const [unblockingId, setUnblockingId] = useState(null);

    useEffect(() => {
        loadBlockedUsers();
    }, []);

    const loadBlockedUsers = async () => {
        try {
            await dispatch(fetchBlockedUsers());
        } catch (error) {
            console.error('Ошибка загрузки черного списка:', error);
        }
    };

    const handleUnblock = async (userId) => {
        if (window.confirm('Вы уверены, что хотите разблокировать этого пользователя?')) {
            try {
                setUnblockingId(userId);
                await dispatch(unblockUser(userId));

                await dispatch(fetchBlockedUsers());
            } catch (error) {
                alert('Ошибка при разблокировке пользователя');
            } finally {
                setUnblockingId(null);
            }
        }
    };

    const handleViewProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (blockedUsersLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Загрузка черного списка...</p>
            </div>
        );
    }
    return (
        <div className="w-full max-w-md sm:max-w-lg m-1.5 md:max-w-2xl lg:max-w-4xl mx-auto p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl min-h-screen bg-[rgba(1,14,24,0.946)]">

            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <div className="order-2 sm:order-1">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-1 sm:mb-2 tracking-tight">
                            Черный список
                        </h1>
                        <p className="text-white/70 text-sm sm:text-base">
                            Управление заблокированными пользователями
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="order-1 sm:order-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:gap-3 active:scale-95 w-full sm:w-auto"
                    >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Назад
                    </button>
                </div>


                <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center">
                            <div className="p-2 sm:p-3 bg-red-500/20 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-white/80 text-sm sm:text-base">Заблокированных пользователей</h3>
                                <p className="text-2xl sm:text-3xl font-bold text-white">{blockedUsers.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {blockedUsersError && (
                <div className="mb-4 sm:mb-6 bg-red-500/10 border border-red-500/30 p-3 sm:p-4 rounded-lg sm:rounded-xl backdrop-blur-sm">
                    <div className="flex items-start">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-300 text-sm sm:text-base">{blockedUsersError}</p>
                    </div>
                </div>
            )}


            <div className="space-y-3 sm:space-y-4">
                {blockedUsers.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                        <div className="mb-4 sm:mb-6">
                            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-white/30 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-light text-white mb-2 sm:mb-3">
                            Черный список пуст
                        </h3>
                        <p className="text-white/60 text-sm sm:text-base max-w-xs sm:max-w-md mx-auto px-4">
                            Вы еще не заблокировали ни одного пользователя
                        </p>
                    </div>
                ) : (
                    blockedUsers.map((user) => (
                        <div
                            key={user.id}
                            className="group bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 p-3 sm:p-4 md:p-5 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                                <div className="flex items-center space-x-3 sm:space-x-4">

                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 overflow-hidden border-2 border-white/20">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar || user.profile?.avatar}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://avatars.mds.yandex.net/i?id=1fec8837c92eca6c1175ac4c8e6d56383e5d7956-5603780-images-thumbs&n=13';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/10">
                                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                    </div>


                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-medium text-white text-base sm:text-lg mb-0.5 sm:mb-1 truncate">
                                            {user.name || user.profile?.name || 'Пользователь'}
                                        </h3>

                                        {user.blocked_at && (
                                            <p className="text-white/50 text-xs">
                                                Заблокирован: {formatDate(user.blocked_at)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Кнопки действий */}
                                <div className="flex items-center space-x-2 sm:space-x-3 pt-2 sm:pt-0 border-t border-white/10 sm:border-t-0">
                                    <button
                                        onClick={() => handleViewProfile(user.id)}
                                        className="flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                                    >
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span className="hidden sm:inline">Профиль</span>
                                        <span className="sm:hidden">Проф.</span>
                                    </button>

                                    <button
                                        onClick={() => handleUnblock(user.id)}
                                        disabled={unblockingId === user.id}
                                        className={`flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base ${
                                            unblockingId === user.id
                                                ? 'bg-green-500/40 text-white/70 cursor-not-allowed'
                                                : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200'
                                        }`}
                                    >
                                        {unblockingId === user.id ? (
                                            <>
                                                <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="hidden sm:inline">Разблокировка...</span>
                                                <span className="sm:hidden">...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                                <span className="hidden sm:inline">Разблокировать</span>
                                                <span className="sm:hidden">Разбл.</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>





        </div>
    );
};

export default BlockedUsersList;