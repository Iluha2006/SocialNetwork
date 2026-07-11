
const parseUTC = (val) => {
    if (!val) return null;
    if (typeof val === 'number') return new Date(val * 1000);
    const s = String(val);
    return new Date(s && !s.endsWith('Z') && !s.includes('+') ? s + 'Z' : s);
};

export const combineAndSortMessages = (conversations, audioConversations, currentUserId, otherUserId) => {
    if (!currentUserId || !otherUserId) return [];

    const key = [currentUserId, parseInt(otherUserId)].sort().join('-');
    const textMsgs = conversations?.[key]?.messages || [];
    const audioMsgs = audioConversations?.[key]?.messages || [];

    const combined = [
      ...textMsgs.map(msg => ({
        ...msg,
        type: 'text',
        senderId: msg.senderId,
        timestamp: msg.timestamp || parseUTC(msg.created_at).getTime() / 1000,
        created_at: msg.created_at,
      })),
      ...audioMsgs.map(msg => ({
        ...msg,
        type: 'audio',
        senderId: msg.sender_id,
        timestamp: parseUTC(msg.created_at).getTime() / 1000,
        created_at: msg.created_at,
      })),
    ];


    return combined.sort((a, b) => a.timestamp - b.timestamp);
  };