import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from './configAuth';
import { setAuthData, clearAuth, setLoading, setError } from '../store/Auth/UserStore';
import { profileApi } from '../api/modules/profileApi';
import { setProfile } from '../store/settings/Profile';
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
                dispatch(clearAuth())
                try {
                    const { data } = await queryFulfilled;
                    console.log('Login response:', data);

                    if (data?.user && data.user.id) {

                        dispatch(setAuthData({ user: data.user }));


                        dispatch(setProfile({
                            user_id: data.user.id,
                            name: data.user.name,
                            email: data.user.email,
                            avatar: data.user.avatar,
                            bio: data.user.bio,
                            created_at: data.user.created_at
                        }));


                        const { getEcho } = await import('../echo');
                        getEcho();


                        dispatch(
                            profileApi.endpoints.getProfile.initiate(data.user.id, { forceRefetch: true })
                        );
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

                        dispatch(setProfile({
                            user_id: user.id,
                            name: user.name,
                            email: user.email,
                            avatar: user.avatar,
                            bio: user.bio,
                            created_at: user.created_at
                        }));

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
                    const { getEcho } = await import('../echo');
                    getEcho();
                    dispatch(clearAuth());
                    dispatch({ type: 'profile/clearProfile' });
                } catch {
                    dispatch(clearAuth());
                }
            },
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