import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const callSlice = createSlice({
    name: 'calls',
    initialState: {
        currentCall: null,
        incomingCall: null,
        callStatus: 'idle',
        error: null,
        loading: false,

    },
    reducers: {
        setCurrentCall: (state, action) => {
            state.currentCall = action.payload;
        },

        setIncomingCall: (state, action) => {
            state.incomingCall = action.payload;
        },
        setCallStatus: (state, action) => {
            state.callStatus = action.payload;
        },
        setCallLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCallError: (state, action) => {
            state.error = action.payload;
        },

        clearCall: (state) => {
            state.currentCall = null;
            state.incomingCall = null;
            state.callStatus = 'idle';
            state.error = null;

        }
    }
});

export const {
    setCurrentCall,

    setIncomingCall,
    setCallStatus,
    setCallLoading,
    setCallError,
    clearCall
} = callSlice.actions;


export const initiateCall = (callData) => async (dispatch, getState) => {
    try {
        dispatch(setCallLoading(true));
        const token = getState().user.token;



        const response = await axios.post('/calls/initiate', callData, {
            headers: {
             //   'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });


        dispatch(setCurrentCall(response.data));

        return {
            success: true,
            payload: response.data
        };
    } catch (error) {

        const errorData = error.response?.data || {};
        const errorMsg = errorData.error || error.message || 'Ошибка инициации звонка';

        dispatch(setCallError(errorMsg));

        return {
            success: false,
            error: errorMsg,
            payload: errorData
        };
    } finally {
        dispatch(setCallLoading(false));
    }
};

export const acceptCall = (callId, sdpAnswer = null) => async (dispatch, getState) => {
    try {
        const token = getState().user.token;

        const response = await axios.post(`/calls/accept/${callId}`, {
            sdp_answer: sdpAnswer
        }, {
            headers: {
              //  'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        dispatch(setCallStatus('ongoing'));
        return { success: true };
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Ошибка принятия звонка';
        return { success: false, error: errorMsg };
    }
};

export const rejectCall = (callId) => async (dispatch, getState) => {
    try {
        const token = getState().user.token;

        await axios.post(`/calls/reject/${callId}`, {}, {
            headers: {
              //  'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        dispatch(clearCall());
        return { success: true };
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Ошибка отклонения звонка';
        return { success: false, error: errorMsg };
    }
};

export const endCall = (callId) => async (dispatch, getState) => {
    try {
        const token = getState().user.token;

        await axios.post(`/calls/end/${callId}`, {}, {
            headers: {
               // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        dispatch(clearCall());
        return { success: true };
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Ошибка завершения звонка';
        return { success: false, error: errorMsg };
    }
};

export const sendICECandidate = (callId, candidate, targetUserId) => async (_dispatch, getState) => {
    try {
        const token = getState().user.token;

        await axios.post(`/calls/ice-candidate/${callId}`, {
            candidate,
            target_user_id: targetUserId
        }, {
            headers: {
              //  'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        return { success: true };
    } catch (error) {
        const errorMsg = error.response?.data?.error || 'Ошибка отправки ICE candidate';
        return { success: false, error: errorMsg };
    }
};

export default callSlice.reducer;
