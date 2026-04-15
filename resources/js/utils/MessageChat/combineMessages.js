
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
        timestamp: msg.timestamp || new Date(msg.created_at).getTime() / 1000,
        created_at: msg.created_at,
      })),
      ...audioMsgs.map(msg => ({
        ...msg,
        type: 'audio',
        senderId: msg.sender_id,
        timestamp: new Date(msg.created_at).getTime() / 1000,
        created_at: msg.created_at,
      })),
    ];


    return combined.sort((a, b) => a.timestamp - b.timestamp);
  };