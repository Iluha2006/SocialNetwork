import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from './configAuth';
import {
    setOAuthUser,
    setOAuthLoading,
    setOAuthError,
    setOAuthProvider,
    setOAuthData,
    clearOAuth
} from '../store/Auth/Oauth';
import { profileApi } from './modules/profileApi';
import { setProfile } from '../store/settings/Profile';

export const oauthApi = createApi({
    reducerPath: 'oauthApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['OAuth', 'Yandex', 'Google'],
    endpoints: (build) => ({
        yandexCallback: build.mutation({
            query: (code) => ({
                url: `/auth/yandex/callback`,
                method: 'POST',
                body:{code},
                headers: {
                    'Accept': 'application/json',

                },
            }),
            invalidatesTags: ['Yandex'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setOAuthLoading(true));
                dispatch(setOAuthError(null));
                dispatch(setOAuthProvider('yandex'));
                dispatch(clearOAuth());

                    const { data } = await queryFulfilled;





                    if (data?.success && data?.user) {
                        const userData = data.user;

                        dispatch(setOAuthUser(data.user));
                        dispatch(setOAuthData({
                            provider: 'yandex',
                            ...data
                        }));


                        dispatch(
                            profileApi.util.upsertQueryData(
                                'getProfile',
                                data.user.id,
                                { data: data.user }
                            )
                        );
                        const { getEcho } = await import('../echo');
                        getEcho();


                        dispatch(
                            profileApi.endpoints.getProfile.initiate(userData.id, { forceRefetch: true })
                        );
                    }


            },
        }),


        googleCallback: build.mutation({
            query: (code) => ({
                url: '/auth/google/callback',
                method: 'POST',
                body: { code },
            }),
            invalidatesTags: ['Google'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                dispatch(setOAuthLoading(true));
                dispatch(setOAuthError(null));
                dispatch(setOAuthProvider('google'));

                try {
                    const { data } = await queryFulfilled;

                    console.log('Google callback response:', data);

                    if (data?.success && data?.user) {
                        const userData = data.user;

                        dispatch(setOAuthUser({
                            id: userData.id,
                            name: userData.name,
                            providers: userData.providers || [],
                        }));

                        dispatch(setOAuthData({
                            provider: 'google',
                            ...data
                        }));

                        dispatch(setProfile({
                            user_id: userData.id,
                            name: userData.name,
                        }));

                        const { getEcho } = await import('../echo');
                        getEcho();

                        dispatch(
                            profileApi.endpoints.getProfile.initiate(userData.id, { forceRefetch: true })
                        );
                    }
                } catch (err) {
                    console.error('Google callback error:', err);
                    dispatch(setOAuthError(
                        err.error?.data?.message ||
                        err.message ||
                        'Ошибка авторизации через Google'
                    ));
                } finally {
                    dispatch(setOAuthLoading(false));
                }
            },
        }),


        oauthLogout: build.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    const { destroyEcho } = await import('../echo');
                    destroyEcho();
                    dispatch(clearOAuth());
                    dispatch({ type: 'profile/clearProfile' });
                } catch (error) {
                    console.error('Logout error:', error);
                    dispatch(clearOAuth());
                }
            },
        }),
    }),
});

export const {
    useYandexCallbackMutation,
    useGoogleCallbackMutation,
    useOauthLogoutMutation,
} = oauthApi;
