/**
 * WebSocket service for calls (Laravel Reverb / Echo).
 * Placeholder - extend with actual implementation when call API is ready.
 */

const noop = () => {};
const createSubscription = () => ({ stop: noop });

export const websocketService = {
    subscribeToIncomingCalls: (userId, handler) => {
        // TODO: implement with Laravel Echo when call channels are ready
        return createSubscription();
    },
    subscribeToCallAccepted: (userId, handler) => {
        return createSubscription();
    },
    subscribeToCallRejected: (userId, handler) => {
        return createSubscription();
    },
    subscribeToCallEnded: (userId, handler) => {
        return createSubscription();
    },
    unsubscribeAll: (userId) => {
        // no-op
    },
    sendSdpAnswer: async (callId, sdpAnswer) => {
        // TODO: implement when call WebSocket API is ready
        return Promise.resolve();
    },
};
