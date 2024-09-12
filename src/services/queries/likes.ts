import { client } from "$services/redis";
import { itemKey, userLikesKey } from "$services/keys";
import { getItems } from "./items";

export const userLikesItem = async (itemId: string, userId: string) => {
    return await client.sIsMember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
    const ids = await client.sMembers(userLikesKey(userId));

    return getItems(ids);
};

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

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
    const userOneLikes = await client.sMembers(userLikesKey(userOneId));
    const userTwoLikes = await client.sMembers(userLikesKey(userTwoId));

    return getItems(userOneLikes.filter((id) => userTwoLikes.includes(id)));
};
