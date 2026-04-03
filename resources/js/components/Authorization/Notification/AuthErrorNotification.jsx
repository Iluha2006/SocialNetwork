// src/components/Auth/AuthErrorNotification.tsx
import { Link, useLocation } from 'react-router-dom';


export default function AuthErrorNotification({
    error,
    resendLinkText = 'Отправить письмо подтверждения повторно',
    resendPath = '/resend-verification',
    email = '',
    verificationKeyword = 'подтвердите',
    className = '',
})
 {
  const location = useLocation();

  const isVerificationError = error.toLowerCase().includes(verificationKeyword.toLowerCase());

  const getStyles = () => {
    if (isVerificationError) {
      return {
        container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        border: 'border-yellow-200',
        link: 'text-emerald-700 hover:text-emerald-800',
      };
    }
    return {
      container: 'bg-red-50 border-red-200 text-red-700',
      border: 'border-red-200',
      link: 'text-emerald-600 hover:text-emerald-700',
    };
  };

  const styles = getStyles();

  return (
    <div className={`mb-6 p-4 rounded-md border ${styles.container} ${className}`}>
      <p className="text-sm font-medium">{error}</p>


      {isVerificationError && (
        <div className={`mt-3 pt-3 border-t ${styles.border}`}>
          <Link
            to={resendPath}
            state={{
              email,
              from: location.pathname
            }}
            className={`text-sm font-bold ${styles.link} hover:underline flex items-center gap-1 transition-colors`}
          >
             {resendLinkText}
          </Link>
        </div>
      )}
    </div>
  );
}