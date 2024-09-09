export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const userKey = (userId: string) => `user#${userId}`;
export const sessionsKey = (sessionId: string) => `sessions#${sessionId}`;
export const itemKey = (itemId: string) => `item#${itemId}`;
export const usernamesUniqueKey = () => 'usernames:unique';
export const userLikesKey = (userId: string) => `users:likes#${userId}`;