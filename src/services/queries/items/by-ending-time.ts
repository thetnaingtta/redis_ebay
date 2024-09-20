import { client } from '$services/redis';
import { itemsByEndingAtKey, itemsKey } from '$services/keys';
import { deserialize } from './deserialize';

export const itemsByEndingTime = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	const items = await client.zRange(itemsByEndingAtKey(), Date.now(), '+inf', {
		BY: 'SCORE',
		LIMIT: { offset, count }
	});

	const result = await Promise.all(items.map((id) => client.hGetAll(itemsKey(id))));

	return result.map((item, i) => {
		return Object.keys(item).length === 0 ? null : deserialize(items[i], item);
	});
};
