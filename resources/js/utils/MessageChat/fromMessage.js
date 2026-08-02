

const formatMessageTime = (message) => {
    const raw = message.timestamp || message.created_at;
    const dateStr = typeof raw === 'string' && !raw.endsWith('Z') && !raw.includes('+') ? raw + 'Z' : raw;
    return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};


export default formatMessageTime;