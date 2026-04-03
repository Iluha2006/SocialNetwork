import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../configAuth';

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['Search'],
    endpoints: (build) => ({
        searchUsers: build.query({
            query: (query) => ({
                url: '/profile',
                params: { query },
            }),

            transformResponse: (response) => {

                if (Array.isArray(response)) {
                    return response;
                }

                if (response && response.data && Array.isArray(response.data)) {
                    return response.data;
                }

                if (response && typeof response === 'object') {

                    return [];
                }
                return [];
            },

            providesTags: (result) => {

                if (result && Array.isArray(result) && result.length > 0) {
                    return result.map(({ id }) => ({ type: 'Search', id }));
                }

                return ['Search'];
            },

            transformErrorResponse: (response) => {
                if (response.status === 401) {
                    return { message: 'Требуется авторизация' };
                }
                return response.data ;
            },
        }),
    }),
});

export const { useSearchUsersQuery } = searchApi;
export default searchApi;