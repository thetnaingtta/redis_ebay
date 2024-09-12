import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { userKey, usernamesUniqueKey, usernamesKey } from '$services/keys';
import { attr } from 'svelte/internal';

export const getUserByUsername = async (username: string) => {
	// use the username arg to check userid with username sorted set

	const decimalId = await client.zScore(usernamesKey(), username);

	// make sure we actuall got and ID from the lookup
	if (!decimalId) {
		throw new Error('User not found');
	}

	const id = decimalId.toString(16);
	const user = await client.hGetAll(userKey(id));

	// deserialize the user object from the hash
	return deserialize(id, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(userKey(id));
	return Object.keys(user).length === 0 ? null : deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const exists = await client.zScore(usernamesKey(), attrs.username);

	if (exists) {
		throw new Error('Username already exists');
	}

	const id = genId();

	await client.hSet(userKey(id), serialize(attrs));
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(id, 16)
	});
	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
