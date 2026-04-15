import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from './configAuth';
import { setAuthData, clearAuth, setLoading, setError } from '../store/Auth/UserStore';

import { profileApi } from '../api/modules/profileApi';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['Auth'],

    endpoints: (build) => ({

        login: build.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                dispatch(setError(null));
                dispatch(clearAuth());

                try {
                    const { data } = await queryFulfilled;
                    const user = data?.data?.user || data?.user;

                    if (user?.id) {

                        dispatch(setAuthData({
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            }
                        }));


                        dispatch(
                            profileApi.util.updateQueryData('getProfile', user.id, (draft) => {

                                if (draft) Object.assign(draft, user);
                            })
                        );


                        dispatch(
                            profileApi.endpoints.getProfile.initiate(user.id, {
                                forceRefetch: true,
                                subscribe: false
                            })
                        );


                        const { getEcho } = await import('../echo');
                        getEcho();
                    }
                } catch (err) {
                    dispatch(setError(err.error?.data?.message || 'Ошибка входа'));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),
        register: build.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setLoading(true));
                dispatch(setError(null));
                try {
                    const { data } = await queryFulfilled;
                    console.log('Register response:', data);

                    const user = data?.data?.user || data?.user;

                    if (user) {
                        dispatch(setAuthData({ user }));

                        dispatch(
                            profileApi.util.updateQueryData('getProfile', user.id, (draft) => {

                                if (draft) Object.assign(draft, user);
                            })
                        );
                        dispatch(
                            profileApi.endpoints.getProfile.initiate(user.id, {
                                forceRefetch: true,
                                subscribe: false
                            })
                        );
                        const { getEcho } = await import('../echo');
                        getEcho();


                        dispatch(
                            profileApi.endpoints.getProfile.initiate(user.id, { forceRefetch: true })
                        );
                    }
                } catch (err) {
                    dispatch(setError(err.error?.data?.message || 'Ошибка регистрации'));
                } finally {
                    dispatch(setLoading(false));
                }
            },
        }),




        resendVerification: build.mutation({
            query: (email) => ({
                url: '/email/resend',
                method: 'POST',
                body: { email },
            }),
            invalidatesTags: (result, error, email) => [
                { type: 'Verification' }
            ],
        }),

        logout: build.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),

            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {

                    await queryFulfilled;


                    try {
                        const echoModule = await import('../echo');

                        if (typeof echoModule.disconnectEcho === 'function') {
                            echoModule.disconnectEcho();
                        }
                    } catch (echoErr) {
                        console.warn('Echo disconnect error:', echoErr);
                    }
                    dispatch(clearAuth());


                    dispatch(clearProfile());


                    dispatch(profileApi.util.resetApiState());
                    dispatch(authApi.util.resetApiState());

                } catch (err) {

                    dispatch(profileApi.util.resetApiState());
                }
            },


            invalidatesTags: ['Auth', 'Profile', 'BlockedUsers'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,

    useResendVerificationMutation,
    useLogoutMutation,
} = authApi;

export default authApi;