import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContacts, createContact, updateContactData, deleteContact, setCurrentContact, clearError, clearContacts } from '../../../store/ContactUsers';
import cities from './city';
import Notification from './Notification';

const ContactProfile = () => {
  const dispatch = useDispatch();
  const { contact, error, currentContact } = useSelector(state => state.contacts);
  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);

  const [searchQuery, setSearchQuery] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({ city: '', phone: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (currentContact) {
      setFormData({
        city: currentContact.city,
        phone: currentContact.phone
      });
      setIsEditing(true);
    } else {
      setFormData({
        city: '',
        phone: ''
      });
      setIsEditing(false);
    }
  }, [currentContact]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (error) {
      if (typeof error === 'string') {
        setFormError(error);
      } else if (error.errors) {
        setFieldErrors(error.errors);
      } else if (error.message) {
        setFormError(error.message);
      }
    }
  }, [error]);

  const filteredCities = cities.filter(cityItem =>
    cityItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cityItem.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cityItem.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});
    dispatch(clearError());

    const contactData = {
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      profile_id: profile.id
    };

    try {
      if (isEditing && currentContact) {
        await dispatch(updateContactData(currentContact.id, contactData));
        showNotification('Контакт успешно обновлен!');
        resetForm();
      } else {
        await dispatch(createContact(contactData));
        showNotification('Контакт успешно создан!');
        resetForm();
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        setFieldErrors(errorData.errors);
      } else if (errorData?.message) {
        setFormError(errorData.message);
      } else {
        setFormError('Произошла ошибка при сохранении контакта');
      }
    }
  };

  const handlePhoneChange = (e) => {
    setFormData(prev => ({ ...prev, phone: e.target.value }));
    if (fieldErrors.phone) {
      setFieldErrors(prev => ({ ...prev, phone: null }));
    }
  };

  const handleCityChange = (e) => {
    setSearchQuery(e.target.value);
    setFormData(prev => ({ ...prev, city: e.target.value }));
    setShowCityDropdown(true);
    if (fieldErrors.city) {
      setFieldErrors(prev => ({ ...prev, city: null }));
    }
  };

  const selectCity = (selectedCity) => {
    setFormData(prev => ({ ...prev, city: selectedCity.name }));
    setSearchQuery('');
    setShowCityDropdown(false);
    if (fieldErrors.city) {
      setFieldErrors(prev => ({ ...prev, city: null }));
    }
  };

  const handleEdit = (contact) => {
    dispatch(setCurrentContact(contact));
    setFormError('');
    setFieldErrors({});
    dispatch(clearError());
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить контакт?')) {
      try {
        await dispatch(deleteContact(id));
        showNotification('Контакт успешно удален!');

        if (currentContact && currentContact.id === id) {
          resetForm();
        }

        if (user?.id) {
          dispatch(fetchContacts(user.id));
        }
      } catch (error) {
        showNotification('Ошибка при удалении контакта', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      city: '',
      phone: ''
    });
    setSearchQuery('');
    setShowCityDropdown(false);
    setIsEditing(false);
    setFormError('');
    setFieldErrors({});
    dispatch(setCurrentContact(null));
    dispatch(clearError());
  };

  return (
    <div className="
    w-full
    max-w-96
    md:max-w-lg
    lg:max-w-96
    xl:max-w-96
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

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}


      <div className="text-center mb-8">
        <h2 className="
          text-2xl
          md:text-3xl
          font-semibold
          text-white
          mb-2
        ">
          Контактная информация
        </h2>
        <p className="
          text-white/80
          text-base
          md:text-lg
        ">
          Управление вашими контактными данными
        </p>
      </div>


      {formError && (
        <div className="
          mb-6
          p-3
          bg-red-500/20
          border
          border-red-500/30
          text-red-300
          rounded-lg
          text-center
        ">
          {formError}
        </div>
      )}

      {/* Форма */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white/5
          backdrop-blur-sm
          p-6
          rounded-xl
          mb-8
          border
          border-white/10
        "
      >
        {/* Поле телефона */}
        <div className="mb-6">
          <label
            htmlFor="phone"
            className="
              block
              mb-2
              font-medium
              text-white
            "
          >
            Телефон:
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="+7 (999) 999-99-99"
            className={`
              w-full
              px-4
              py-3
              bg-white/10
              border
              ${fieldErrors.phone ? 'border-red-500' : 'border-white/20'}
              rounded-lg
              text-white
              placeholder-white/50
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-transparent
              transition-all
              duration-200
            `}
          />
          {fieldErrors.phone && (
            <div className="
              mt-2
              text-red-400
              text-sm
            ">
              {fieldErrors.phone[0]}
            </div>
          )}
        </div>

        {/* Поле города */}
        <div className="mb-6">
          <label
            htmlFor="city"
            className="
              block
              mb-2
              font-medium
              text-white
            "
          >
            Город:
          </label>
          <div className="relative">
            <input
              type="text"
              id="city"
              value={searchQuery || formData.city}
              onChange={handleCityChange}
              onFocus={() => setShowCityDropdown(true)}
              placeholder="Начните вводить название города"
              className={`
                w-full
                px-4
                py-3
                bg-white/10
                border
                ${fieldErrors.city ? 'border-red-500' : 'border-white/20'}
                rounded-lg
                text-white
                placeholder-white/50
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-transparent
                transition-all
                duration-200
              `}
            />
            {fieldErrors.city && (
              <div className="
                mt-2
                text-red-400
                text-sm
              ">
                {fieldErrors.city[0]}
              </div>
            )}


            {showCityDropdown && searchQuery && (
              <div className="
                absolute
                top-full
                left-0
                right-0
                mt-1
                bg-gray-900
                border
                border-white/20
                rounded-lg
                shadow-xl
                max-h-60
                overflow-y-auto
                z-50
              ">
                {filteredCities.length > 0 ? (
                  filteredCities.map((cityItem, index) => (
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
                      onClick={() => selectCity(cityItem)}
                    >
                      <div className="
                        font-medium
                        text-white
                        mb-1
                      ">
                        {cityItem.name}
                      </div>
                      <div className="
                        text-sm
                        text-white/70
                        mb-1
                      ">
                        {cityItem.region}
                      </div>
                      <div className="
                        text-xs
                        text-white/50
                      ">
                        {cityItem.country}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="
                    p-4
                    text-center
                    text-white/70
                  ">
                    Город не найден
                  </div>
                )}
              </div>
            )}
          </div>
        </div>


        <div className="
          flex
          flex-col
          sm:flex-row
          gap-3
          justify-center
        ">
          <button
            type="submit"
            className="
              px-6
              py-3
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-medium
              rounded-lg
              transition-all
              duration-200
              hover:shadow-lg
              hover:shadow-blue-500/25
              active:scale-95
              flex-1
              sm:flex-none
            "
          >
            {isEditing ? 'Обновить' : 'Создать'} контакт
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="
                px-6
                py-3
                bg-white/10
                hover:bg-white/20
                text-white
                font-medium
                rounded-lg
                transition-all
                duration-200
                hover:shadow-lg
                active:scale-95
                flex-1
                sm:flex-none
              "
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      {/* Список контактов */}
      <div>
        <h3 className="
          text-xl
          md:text-2xl
          font-semibold
          text-white
          mb-6
          text-center
        ">
          Мои контакты
        </h3>

        {contact.length === 0 ? (
          <p className="
            text-center
            text-white/60
            py-8
            italic
          ">
            Контакты не добавлены
          </p>
        ) : (
          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
          ">
            {contact.map((contactItem) => (
              <div
                key={contactItem.id}
                className="
                  bg-white/5
                  backdrop-blur-sm
                  p-5
                  rounded-xl
                  border
                  border-white/10
                  hover:border-white/20
                  transition-all
                  duration-200
                  hover:shadow-lg
                  hover:shadow-blue-500/10
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  justify-between
                  gap-4
                "
              >
                {/* Информация о контакте */}
                <div className="flex-grow">
                  <div className="
                    text-lg
                    font-medium
                    text-white
                    mb-2
                  ">
                    {contactItem.phone}
                  </div>
                  <div className="
                    text-white/70
                  ">
                    {contactItem.city}
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="
                  flex
                  gap-3
                  justify-center
                  sm:justify-end
                ">
                  {/* Кнопка редактирования */}
                  <button
                    onClick={() => handleEdit(contactItem)}
                    className="
                      p-2
                      bg-blue-500/20
                      hover:bg-blue-500/30
                      text-blue-300
                      hover:text-blue-200
                      rounded-lg
                      transition-all
                      duration-200
                      hover:scale-105
                      active:scale-95
                    "
                    title="Редактировать"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293z"/>
                    </svg>
                  </button>


                  <button
                    onClick={() => handleDelete(contactItem.id)}
                    className="
                      p-2
                      bg-red-500/20
                      hover:bg-red-500/30
                      text-red-300
                      hover:text-red-200
                      rounded-lg
                      transition-all
                      duration-200
                      hover:scale-105
                      active:scale-95
                    "
                    title="Удалить"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactProfile;