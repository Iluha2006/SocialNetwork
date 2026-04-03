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

export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: baseQueryWithCsrf,
    tagTypes: ['Profile', 'BlockedUsers', 'AllProfile'],

    endpoints: (build) => ({

        getProfile: build.query({
            query: (userId) => `/profile/${userId}`,
            providesTags: (result, error, userId) => [{ type: 'Profile', id: userId }],
            async onQueryStarted(userId, { dispatch, queryFulfilled, getState }) {
                try {
                    const { data: profileData } = await queryFulfilled;
                    console.log('Profile data received:', profileData);

                    const state = getState();
                    const currentUserId = state.user?.user?.id;

                    if (userId == currentUserId) {
                        dispatch(setProfile(profileData));
                    } else {
                        dispatch(setViewedProfile(profileData));
                        dispatch(setIsBlocked(profileData?.is_blocked || false));
                        dispatch(setHasBlockedThisUser(profileData?.has_blocked_this_user || false));
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            },
        }),

        updateProfile: build.mutation({
            query: ({ userId, ...profileData }) => ({
                url: `/profile/update/${userId}`,
                method: 'PUT',
                body: profileData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: (result, error, { userId }) => [{ type: 'Profile', id: userId }],
            async onQueryStarted({ userId, ...patch }, { dispatch, queryFulfilled }) {
                try {
                    const { data: updatedData } = await queryFulfilled;
                    dispatch(setProfile(updatedData));
                } catch (err) {
                    console.error('Update profile error:', err);
                }
            },
        }),

        blockUser: build.mutation({
            query: (userId) => ({
                url: `/profiles/${userId}/block`,
                method: 'POST',
                headers: { 'Accept': 'application/json' },
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Profile', id: userId },
                'BlockedUsers'
            ],
        }),

        unblockUser: build.mutation({
            query: (userId) => ({
                url: `/profiles/${userId}/unblock`,
                method: 'POST',
                headers: { 'Accept': 'application/json' },
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Profile', id: userId },
                'BlockedUsers'
            ],
        }),

        getBlockedUsers: build.query({
            query: () => '/blocked-users',
            providesTags: (result) => {
                if (result && result.blocked_users && Array.isArray(result.blocked_users)) {
                    return result.blocked_users.map(({ id }) => ({ type: 'BlockedUsers', id }));
                }
                return ['BlockedUsers'];
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data: blockedData } = await queryFulfilled;
                    if (blockedData.success && blockedData.blocked_users) {
                        dispatch(setBlockedUsers(blockedData.blocked_users));
                    }
                } catch (err) {
                    console.error('Get blocked users error:', err);
                }
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