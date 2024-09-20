import { client } from '$services/redis';
import { itemByViewsKey, itemsKey } from '$services/keys';

export const incrementView = async (itemId: string, userId: string) => {
	return Promise.all([
		client.hIncrBy(itemsKey(itemId), 'views', 1),
		client.zIncrBy(itemByViewsKey(), 1, itemId)
	]);
};
