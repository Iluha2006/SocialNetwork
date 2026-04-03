import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const LoginYandex = () => {

  const handleYandexLogin = async () => {
    try {
      const response = await axios.get('/auth/yandex/redirect', {
        withCredentials: true,
        headers: { 'Accept': 'application/json' }
      });

      if (response.data.success && response.data.redirect_url) {

        window.location.href = response.data.redirect_url;
      } else {
        throw new Error(response.data.message || 'Не удалось получить ссылку');
      }
    } catch (error) {
      console.error('Google login start error:', error);
      alert('Ошибка подключения к серверу');
    }
  };

  return (
    <button
      type="button"
      onClick={handleYandexLogin}
      className="group flex items-center gap-3 px-6 py-3  bg-amber-400 hover:bg-gray-50 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm border border-gray-200"
    >

<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 1080.000000 1080.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,1080.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> <path d="M5117 10779 c-1178 -58 -2308 -509 -3217 -1283 -136 -116 -405 -380 -530 -521 -1080 -1216 -1546 -2832 -1284 -4455 154 -959 576 -1865 1218 -2620 116 -136 380 -405 521 -530 1216 -1080 2832 -1546 4455 -1284 992 160 1933 608 2695 1284 141 125 405 394 521 530 1036 1217 1474 2792 1218 4380 -160 992 -608 1933 -1284 2695 -125 141 -394 405 -530 521 -920 783 -2032 1223 -3245 1284 -221 11 -305 11 -538 -1z m2231 -5381 l2 -3388 -595 0 -595 0 0 2925 0 2925 -345 0 c-359 0 -471 -7 -640 -41 -377 -76 -655 -249 -825 -511 -141 -217 -196 -475 -172 -803 36 -480 178 -777 532 -1110 154 -145 288 -244 787 -580 l341 -230 -16 -26 c-10 -15 -395 -594 -857 -1288 l-840 -1260 -639 -1 c-506 0 -637 3 -633 13 2 6 347 522 766 1144 418 623 761 1135 761 1137 0 2 -57 46 -127 99 -649 484 -999 933 -1157 1484 -87 303 -114 676 -75 1018 47 400 204 776 444 1064 398 476 1052 758 1880 810 72 4 551 8 1065 7 l935 -1 3 -3387z"/> </g> </svg>
      <span className="font-medium text-gray-700 group-hover:text-gray-900">
        Войти через Яндекс
      </span>
    </button>
  );
};

export default LoginYandex;