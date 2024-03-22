import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { userKey } from '$services/keys';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(userKey(id));
    return Object.keys(user).length === 0 ? null : deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId();
    await client.hSet(userKey(id), serialize(attrs));
    return id;
};

const serialize = (user: CreateUserAttrs) => {
    return {
        username: user.username,
        password: user.password
    };
}

const deserialize = (id: string, user: { [key: string]: string }) => {
    return {
        id,
        username: user.username,
        password: user.password
    };  
}