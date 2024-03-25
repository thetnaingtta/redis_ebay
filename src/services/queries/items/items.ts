import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
import { genId } from '$services/utils';
import { itemKey } from '$services/keys';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
    const item = await client.hGetAll(itemKey(id));
    return Object.keys(item).length === 0 ? null : deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
    const commands = ids.map((id) => { return client.hGetAll(itemKey(id)) });

    const items = await Promise.all(commands);

    return items.map((item, i) => {
        return Object.keys(item).length === 0 ? null : deserialize(ids[i], item);
    });
};

export const createItem = async (attrs: CreateItemAttrs) => {
    const id = genId();

    const serialized = serialize(attrs);

    await client.hSet(itemKey(id), serialized);

    return id;
};


