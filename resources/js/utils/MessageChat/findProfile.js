export const findProfileById = (profiles, targetId) => {
    if (!Array.isArray(profiles)) return null;
    const id = parseInt(targetId);
    return profiles.find(p => p.user_id === id || p.id === id || p.user?.id === id);
  };