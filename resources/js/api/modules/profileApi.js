import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCsrf } from '../configAuth';
import {
    setProfile,
    setViewedProfile,
    setIsBlocked,
    setHasBlockedThisUser,
    setAllProfiles,
    setBlockedUsers
} from '../../store/settings/Profile';
import { data } from 'react-router-dom';

export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['Profile', 'BlockedUsers', 'AllProfile'],

    endpoints: (build) => ({

        getProfile: build.query({
            query: (userId) => `/profile/${userId}`,
            providesTags: (result, error, userId) => [{ type: 'Profile', id: userId }],

        }),


updateProfile: build.mutation({
    query: ({ userId, ...profileData }) => ({
        url: `/profile/update/${userId}`,
        method: 'PUT',
        body: profileData,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    }),
    invalidatesTags: (result, error, { userId }) => [{ type: 'Profile', id: userId }],

    async onQueryStarted({ userId, ...patch }, { dispatch, queryFulfilled }) {
        // 1. Создаём "патч" для возможного отката
        const patchResult = dispatch(
            profileApi.util.updateQueryData('getProfile', userId, (draft) => {
                // Нормализуем под вашу структуру ответа
                if (draft?.data?.user) {
                    Object.assign(draft.data.user, patch);
                } else if (draft) {
                    Object.assign(draft, patch);
                }
            })
        );

        try {

            await queryFulfilled;

        } catch {

            patchResult.undo();
            console.error('Update profile failed, rolled back');
        }
    },
}),
blockUser: build.mutation({
    query: (userId) => ({
        url: `/profiles/${userId}/block`,
        method: 'POST',
        headers: { 'Accept': 'application/json' },
    }),
    invalidatesTags: (result, error, userId) => [
        { type: 'Profile', id: userId },
        'BlockedUsers'
    ],

    async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
            profileApi.util.updateQueryData('getProfile', userId, (draft) => {

                if (draft?.data?.user) {
                    draft.data.user.is_blocked = true;
                    draft.data.user.has_blocked_this_user = true;
                } else if (draft) {
                    draft.is_blocked = true;
                    draft.has_blocked_this_user = true;
                }
            })
        );

        try {
            await queryFulfilled;
        } catch {
            patchResult.undo();
        }
    },
}),


unblockUser: build.mutation({
    query: (userId) => ({
        url: `/profiles/${userId}/unblock`,
        method: 'POST',
        headers: { 'Accept': 'application/json' },
    }),
    invalidatesTags: (result, error, userId) => [
        { type: 'Profile', id: userId },
        'BlockedUsers'
    ],

    async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
            profileApi.util.updateQueryData('getProfile', userId, (draft) => {
                if (draft?.data?.user) {
                    draft.data.user.is_blocked = false;
                    draft.data.user.has_blocked_this_user = false;
                } else if (draft) {
                    draft.is_blocked = false;
                    draft.has_blocked_this_user = false;
                }
            })
        );

        try {
            await queryFulfilled;
        } catch {
            patchResult.undo();
        }
    },
}),


getBlockedUsers: build.query({
    query: () => '/blocked-users',
    providesTags: (result) => {
        if (result?.blocked_users?.length) {
            return result.blocked_users.map(({ id }) => ({ type: 'BlockedUsers', id }));
        }
        return ['BlockedUsers'];
    },

}),


        getAllProfiles: build.query({
            query: () => '/profile',

            providesTags: (result) => {

                if (result && Array.isArray(result)) {
                    return [
                        ...result.map((profile) => ({
                            type: 'AllProfile',
                            id: profile.id || profile.user_id
                        })),
                        { type: 'AllProfile', id: 'LIST' }
                    ];
                }

                return [{ type: 'AllProfile', id: 'LIST' }];
            },

            transformResponse: (response) => {

                if (Array.isArray(response)) {
                    return response;
                }
                if (response && response.data && Array.isArray(response.data)) {
                    return response.data;
                }

                if (response && typeof response === 'object') {

                    const possibleArrays = Object.values(response).filter(
                        val => Array.isArray(val) && val.length > 0
                    );
                    if (possibleArrays.length > 0) {
                        return possibleArrays[0];
                    }
                }

                return [];
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data: profilesData } = await queryFulfilled;

                    let profilesArray = [];
                    if (Array.isArray(profilesData)) {
                        profilesArray = profilesData;
                    } else if (profilesData?.data && Array.isArray(profilesData.data)) {
                        profilesArray = profilesData.data;
                    } else {
                        profilesArray = [];
                    }

                    if (profilesArray.length > 0) {
                        dispatch(setAllProfiles(profilesArray));
                    }
                } catch (err) {
                    console.error('Get all profiles error:', err);
                }
            },
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useBlockUserMutation,
    useUnblockUserMutation,
    useGetBlockedUsersQuery,
    useGetAllProfilesQuery,
} = profileApi;

export default profileApi;