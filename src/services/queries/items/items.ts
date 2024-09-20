import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
import { genId } from '$services/utils';
import { itemsKey,itemByViewsKey, itemsByEndingAtKey } from '$services/keys';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
    const item = await client.hGetAll(itemsKey(id));

    return Object.keys(item).length === 0 ? null : deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
    const commands = ids.map((id) => { return client.hGetAll(itemsKey(id)) });

    const items = await Promise.all(commands);

    return items.map((item, i) => {
        return Object.keys(item).length === 0 ? null : deserialize(ids[i], item);
    });
};

export const createItem = async (attrs: CreateItemAttrs) => {
    const id = genId();

    const serialized = serialize(attrs);

    await Promise.all([
        client.hSet(itemsKey(id), serialized),
        client.zAdd(itemByViewsKey(), {
            value: id,
            score: 0
        }),
        client.zAdd(itemsByEndingAtKey(), {
            value: id,
            score: attrs.endingAt.toMillis()
        })
    ]);

    return id;
};


