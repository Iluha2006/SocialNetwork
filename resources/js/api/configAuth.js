import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1];
}

export const baseQueryWithCsrf = fetchBaseQuery({
  baseUrl: 'http://127.0.0.1:8000',
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    const xsrfToken = getCookie('XSRF-TOKEN');
    if (xsrfToken) {
      headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfToken));
    }

    return headers;
  },
});

