export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const sessionsKey = (sessionId: string) => `sessions#${sessionId}`;

// items
export const itemsKey = (itemId: string) => `item#${itemId}`;
export const itemByViewsKey = () => 'items:byviews';
export const itemsByEndingAtKey = () => 'items:endingAt';

// user
export const userLikesKey = (userId: string) => `users:likes#${userId}`;
export const usernamesKey = () => 'usernames';
export const userKey = (userId: string) => `user#${userId}`;