import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useYandexCallbackMutation } from '../../../api/OauthApi';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    const [yandexCallback] = useYandexCallbackMutation();

    useEffect(() => {
        const handleCallback = async () => {




                const result = await yandexCallback({ code }).unwrap();
                if (result && result.success) {
                    navigate('/home', { replace: true });
                } else {
                    navigate('/error-oauth');
                }
                }




        handleCallback();
    }, [code, navigate, yandexCallback]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-700 font-medium">Завершение входа через Яндекс</p>
        </div>
    );
};

export default OAuthCallback;
