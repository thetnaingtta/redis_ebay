import { client } from "$services/redis";
import { itemKey, userLikesKey } from "$services/keys";

export const userLikesItem = async (itemId: string, userId: string) => {
    return await client.sIsMember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {};

export const likeItem = async (itemId: string, userId: string) => {
    const inserted = await client.sAdd(userLikesKey(userId), itemId);

    if (inserted) {
        return client.hIncrBy(itemKey(itemId), 'likes', 1);
    }
};

export const unlikeItem = async (itemId: string, userId: string) => {
   const removed = await client.sRem(userLikesKey(userId), itemId);

   if (removed) {
       return client.hIncrBy(itemKey(itemId), 'likes', -1);
   }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {};
