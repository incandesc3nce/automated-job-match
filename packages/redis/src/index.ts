import { RedisClient } from 'bun';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

export const redisClient = new RedisClient(`redis://${REDIS_HOST}:${REDIS_PORT}`);

redisClient.onconnect = () => {
  console.log(`Connected to Redis server on port ${REDIS_PORT}`);
};
