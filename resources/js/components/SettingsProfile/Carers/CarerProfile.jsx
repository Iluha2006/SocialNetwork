import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchCarers,
    createCarer,
    updateCarerById,
    clearMessages
} from '../../../store/settings/Carer';
import cities from '../ContactProfile/city';

const CarerProfile = () => {
    const dispatch = useDispatch();
    const { carers, loading, error, successMessage } = useSelector(state => state.carer);
    const user = useSelector(state => state.user.user);

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        city: '',
        place_work: '',
        work_experience: '',
        skills_work: '',
        position: ''
    });
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCarers(user.id));
        }
    }, [dispatch, user?.id]);

    useEffect(() => {
        if (error || successMessage) {
            const timer = setTimeout(() => {
                dispatch(clearMessages());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, successMessage, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'city') {
            if (value.length > 1) {
                const filteredCities = cities.filter(city =>
                    city.name.toLowerCase().includes(value.toLowerCase()) ||
                    city.region.toLowerCase().includes(value.toLowerCase()) ||
                    city.country.toLowerCase().includes(value.toLowerCase())
                );
                setCitySuggestions(filteredCities.slice(0, 5));
                setShowSuggestions(true);
            } else {
                setCitySuggestions([]);
                setShowSuggestions(false);
            }
        }
    };

    const selectCity = (city) => {
        setFormData(prev => ({
            ...prev,
            city: `${city.name}, ${city.region}`
        }));
        setShowSuggestions(false);
        setCitySuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await dispatch(updateCarerById(editingId, formData));
            } else {
                await dispatch(createCarer(formData));
            }
            resetForm();
        } catch (error) {
            console.error('Error saving carer:', error);
        }
    };

    const handleEdit = (carer) => {
        setFormData({
            city: carer.city || '',
            place_work: carer.place_work || '',
            work_experience: carer.work_experience || '',
            skills_work: carer.skills_work || '',
            position: carer.position || ''
        });
        setEditingId(carer.id);
        setIsEditing(true);
        setShowSuggestions(false);
        setCitySuggestions([]);
    };

    const handleCancel = () => {
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            city: '',
            place_work: '',
            work_experience: '',
            skills_work: '',
            position: ''
        });
        setEditingId(null);
        setIsEditing(false);
        setCitySuggestions([]);
        setShowSuggestions(false);
    };

    const startAddingNew = () => {
        setIsEditing(true);
        setEditingId(null);
    };

    if (loading && carers.length === 0) {
        return (
            <div className="
                 max-w-34
                sm:max-w-4xl
                mx-auto
                p-6
                md:p-8
                rounded-2xl
                md:rounded-3xl
                bg-[rgba(1,14,24,0.946)]
                my-4
                md:my-8
            ">
                <div className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    py-20
                    text-white/70
                ">
                    <div className="
                        w-6
                        h-6
                        border-2
                        border-white/30
                        border-t-white
                        rounded-full
                        animate-spin
                    "></div>
                    <span className="text-lg">Загрузка опыта работы...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="
           max-w-96
           sm:max-w-4xl
            mx-auto
            p-6
            md:p-8
            rounded-2xl
            md:rounded-3xl
            bg-[rgba(1,14,24,0.946)]
            my-4
            md:my-8
        ">

            <div className="
                text-center
                mb-8
                md:mb-10
                pb-6
                border-b
                border-white/10
            ">
                <h2 className="
                    text-2xl
                    md:text-3xl
                    font-semibold
                    text-white
                    mb-3
                ">
                    Опыт работы
                </h2>
                <p className="
                    text-white/80
                    text-base
                    md:text-lg
                ">
                    Управление вашим профессиональным опытом
                </p>
            </div>


            {error && (
                <div className="
                    mb-6
                    p-4
                    bg-red-500/10
                    border-l-4
                    border-red-500
                    text-red-300
                    rounded-r-lg
                    animate-in
                    fade-in-0
                ">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="
                    mb-6
                    p-4
                    bg-green-500/10
                    border-l-4
                    border-green-500
                    text-green-300
                    rounded-r-lg
                    animate-in
                    fade-in-0
                ">
                    {successMessage}
                </div>
            )}


            <div className="mb-8">
                {!isEditing && (
                    <button
                        onClick={startAddingNew}
                        className="
                            w-full
                            md:w-auto
                            px-6
                            py-3
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            font-medium
                            rounded-xl
                            transition-all
                            duration-200
                            hover:shadow-lg
                            hover:shadow-blue-500/25
                            active:scale-95
                            flex
                            items-center
                            justify-center
                            gap-2
                        "
                    >
                        <span className="text-xl">+</span>
                        Добавить опыт работы
                    </button>
                )}
            </div>


            {isEditing && (
                <form
                    onSubmit={handleSubmit}
                    className="
                        mb-8
                        p-6
                        md:p-8
                        bg-white/5
                        backdrop-blur-sm
                        rounded-2xl
                        border
                        border-white/10
                        animate-in
                        fade-in-0
                        zoom-in-95
                    "
                >
                    <div className="space-y-6">

                        <div>
                            <label className="
                                block
                                mb-2
                                font-medium
                                text-white
                            ">
                                Город *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Начните вводить город..."
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        bg-white/10
                                        border
                                        border-white/20
                                        rounded-xl
                                        text-white
                                        placeholder-white/50
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                        focus:border-transparent
                                        transition-all
                                        duration-200
                                    "
                                    required
                                />
                                {showSuggestions && citySuggestions.length > 0 && (
                                    <div className="
                                        absolute
                                        top-full
                                        left-0
                                        right-0
                                        mt-1
                                        bg-gray-900
                                        border
                                        border-white/20
                                        rounded-xl
                                        shadow-xl
                                        max-h-60
                                        overflow-y-auto
                                        z-50
                                        animate-in
                                        fade-in-0
                                        zoom-in-95
                                    ">
                                        {citySuggestions.map((city, index) => (
                                            <div
                                                key={index}
                                                className="
                                                    p-3
                                                    cursor-pointer
                                                    border-b
                                                    border-white/10
                                                    hover:bg-white/10
                                                    transition-colors
                                                    duration-150
                                                    last:border-b-0
                                                "
                                                onClick={() => selectCity(city)}
                                            >
                                                <div className="
                                                    font-medium
                                                    text-white
                                                    mb-1
                                                ">
                                                    {city.name}
                                                </div>
                                                <div className="
                                                    text-sm
                                                    text-white/70
                                                ">
                                                    {city.region}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>


                        <div>
                            <label className="
                                block
                                mb-2
                                font-medium
                                text-white
                            ">
                                Место работы *
                            </label>
                            <input
                                type="text"
                                name="place_work"
                                value={formData.place_work}
                                onChange={handleInputChange}
                                placeholder="Название компании или организации"
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    bg-white/10
                                    border
                                    border-white/20
                                    rounded-xl
                                    text-white
                                    placeholder-white/50
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-transparent
                                    transition-all
                                    duration-200
                                "
                                required
                            />
                        </div>


                        <div>
                            <label className="
                                block
                                mb-2
                                font-medium
                                text-white
                            ">
                               Должность
                            </label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                placeholder="Ваша должность"
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    bg-white/10
                                    border
                                    border-white/20
                                    rounded-xl
                                    text-white
                                    placeholder-white/50
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-transparent
                                    transition-all
                                    duration-200
                                "
                                required
                            />
                        </div>

                        <div>
                            <label className="
                                block
                                mb-2
                                font-medium
                                text-white
                            ">
                                Опыт работы
                            </label>
                            <textarea
                                name="work_experience"
                                value={formData.work_experience}
                                onChange={handleInputChange}
                                placeholder="Опишите ваш опыт работы, обязанности и достижения..."
                                rows="4"
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    bg-white/10
                                    border
                                    border-white/20
                                    rounded-xl
                                    text-white
                                    placeholder-white/50
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-transparent
                                    transition-all
                                    duration-200
                                    resize-y
                                    min-h-[100px]
                                "
                            />
                        </div>


                        <div>
                            <label className="
                                block
                                mb-2
                                font-medium
                                text-white
                            ">
                                Навыки и умения
                            </label>
                            <textarea
                                name="skills_work"
                                value={formData.skills_work}
                                onChange={handleInputChange}
                                placeholder="Ключевые навыки и умения, полученные на этой работе..."
                                rows="3"
                                className="
                                    w-full
                                    px-4
                                    py-3
                                    bg-white/10
                                    border
                                    border-white/20
                                    rounded-xl
                                    text-white
                                    placeholder-white/50
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-blue-500
                                    focus:border-transparent
                                    transition-all
                                    duration-200
                                    resize-y

                                "
                            />
                        </div>
                    </div>


                    <div className="
                        mt-8
                        flex
                        flex-col
                        sm:flex-row
                        gap-3
                    ">
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                flex-1
                                px-6
                                py-3
                                bg-blue-600
                                hover:bg-blue-700
                                disabled:bg-blue-800/50
                                disabled:cursor-not-allowed
                                text-white
                                font-medium
                                rounded-xl
                                transition-all
                                duration-200
                                hover:shadow-lg
                                hover:shadow-blue-500/25
                                active:scale-95
                                disabled:active:scale-100
                            "
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Сохранение...
                                </span>
                            ) : editingId ? 'Обновить запись' : 'Сохранить запись'}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="
                                flex-1
                                px-6
                                py-3
                                bg-white/10
                                hover:bg-white/20
                                disabled:bg-white/5
                                disabled:cursor-not-allowed
                                text-white
                                font-medium
                                rounded-xl
                                transition-all
                                duration-200
                                hover:shadow-lg
                                active:scale-95
                                disabled:active:scale-100
                            "
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            )}


            <div className="space-y-4">
                {carers.length > 0 ? (
                    carers.map((carer) => (
                        <div
                            key={carer.id}
                            className="
                                p-6
                                bg-white/5
                                backdrop-blur-sm
                                rounded-2xl
                                border
                                border-white/10
                                hover:border-white/20
                                transition-all
                                duration-200
                                hover:shadow-lg
                                hover:shadow-blue-500/10
                                animate-in
                                fade-in-0
                            "
                        >
                            <div className="
                                flex
                                flex-col
                                md:flex-row
                                md:items-start
                                justify-between
                                gap-4
                            ">
                                {/* Информация */}
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <h3 className="
                                            text-xl
                                            font-semibold
                                            text-white
                                            mb-2
                                        ">
                                            {carer.position || 'Должность не указана'}
                                        </h3>

                                        <div className="space-y-2">
                                            <p className="text-white/80">
                                                <span className="font-medium text-white/90">Место работы:</span>{' '}
                                                <span className="text-white/70">{carer.place_work || 'Не указано'}</span>
                                            </p>

                                            <p className="text-white/80">
                                                <span className="font-medium text-white/90">Город:</span>{' '}
                                                <span className="text-white/70">{carer.city || 'Не указан'}</span>
                                            </p>

                                            {carer.work_experience && (
                                                <div>
                                                    <p className="font-medium text-white/90 mb-1">Опыт и обязанности:</p>
                                                    <p className="text-white/70">{carer.work_experience}</p>
                                                </div>
                                            )}

                                            {carer.skills_work && (
                                                <div>
                                                    <p className="font-medium text-white/90 mb-1">Ключевые навыки:</p>
                                                    <p className="text-white/70">{carer.skills_work}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>


                                <div className="
                                    flex
                                    gap-2
                                    md:flex-col
                                    md:gap-3
                                ">
                                    <button
                                        onClick={() => handleEdit(carer)}
                                        disabled={loading}
                                        className="
                                            px-4
                                            py-2
                                            bg-blue-500/20
                                            hover:bg-blue-500/30
                                            disabled:bg-blue-500/10
                                            disabled:cursor-not-allowed
                                            text-blue-300
                                            hover:text-blue-200
                                            rounded-lg
                                            transition-all
                                            duration-200
                                            hover:scale-105
                                            active:scale-95
                                            disabled:active:scale-100
                                            whitespace-nowrap
                                        "
                                    >
                                        Изменить
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : !isEditing && (
                    <div className="
                        p-8
                        text-center
                        bg-white/5
                        backdrop-blur-sm
                        rounded-2xl
                        border
                        border-white/10
                        animate-in
                        fade-in-0
                    ">
                        <p className="
                            text-lg
                            text-white/70
                            mb-2
                        ">
                            Опыт работы не добавлен
                        </p>
                        <p className="
                            text-sm
                            text-white/50
                        ">
                            Нажмите "Добавить опыт работы" чтобы создать первую запись
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarerProfile;