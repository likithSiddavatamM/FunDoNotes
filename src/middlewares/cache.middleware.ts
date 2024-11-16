import { createClient } from 'redis';
import { Request, Response, NextFunction } from 'express';

export const redisClient = createClient();
redisClient.connect();

export const cache = async (req: Request, res: Response, next: NextFunction) => {
  const cachedData = await redisClient.get(
    req.params.id ? `${req.body.createdBy}:${req.params.id}` : req.body.createdBy
  );
  cachedData ? res.json(JSON.parse(cachedData)) : next();
};

export const deleteKey = async (key: string) =>
  await redisClient.del(key);