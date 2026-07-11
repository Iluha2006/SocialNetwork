
const STORAGE_PREFIX = 'likePost_';

const getStorageKey = (postId, userId) => {
    const safeUserId = userId ?? 'guest';
    return `${STORAGE_PREFIX}${safeUserId}_${postId}`;
};

export const saveLikeState = (postId, userId, data) => {
    try {
        const key = getStorageKey(postId, userId);
        localStorage.setItem(key, JSON.stringify({
            count: Number(data?.count) || 0,
            liked: !!data?.liked,
            timestamp: Date.now()
        }));
    } catch (err) {
        console.warn('saveLikeState error:', err);
    }
};

export const getLikeState = (postId, userId) => {
    try {
        const key = getStorageKey(postId, userId);
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        
        const item = JSON.parse(raw);
        if (item && typeof item.count === 'number' && !isNaN(item.count)) {
            return { count: item.count, liked: !!item.liked };
        }
        return null;
    } catch {
        return null;
    }
};



export const clearUserLikes = (userId) => {
    try {
        const safeUserId = userId ?? 'guest';
        const prefix = `${STORAGE_PREFIX}${safeUserId}_`;
        
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        });
    } catch (err) {
        console.warn('clearUserLikes error:', err);
    }
};