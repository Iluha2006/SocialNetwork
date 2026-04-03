
import { useMemo } from 'react';


export const useFilteredSearch = (users, query) => {
  return useMemo(() => {
    if (!query?.trim() || !Array.isArray(users) || users.length === 0) {
      return [];
    }
    const lowerQuery = query.toLowerCase().trim();
    return users.filter(user => {
      if (!user?.name) return false;
      return user.name.toLowerCase().includes(lowerQuery);
    });
  }, [users, query]);
};