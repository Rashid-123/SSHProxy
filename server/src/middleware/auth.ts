import { Request, Response, NextFunction } from 'express';
import { redisClient, connectRedis } from '@/config/redisClient';
import jwt from "jsonwebtoken";
import { config } from '@/config/env';
import logger from '@/config/logger';
import type { AuthRequest } from '@/types/types';
import prisma from '@/lib/prisma';

// Simple in-memory cache (further use Redis)

const ensureConnected = async () => {
    if (!redisClient.isOpen) {
        await connectRedis();
    }
}
export async function authenticateFromCookie(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const bearerToken = req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null;

        const token = req.cookies?.auth_token || bearerToken;
        console.log(token);

        if (!token) {
            logger.warn('No auth token in request');
            return res.status(401).json({ error: 'Unauthorized: No token' });
        }

        // Verify JWT
        const decoded = jwt.verify(token, config.jwtSecret) as {
            userId: string;
        };

        // Check cache first (2 minute TTL)
        await ensureConnected();
        const cached = await redisClient.get(`user:${decoded.userId}`);
    
        let user;

        if (cached) {
            console.log("User found in cache");
            user = JSON.parse(cached);
            logger.debug({ userId: decoded.userId }, 'User from cache');
        } else {
            console.log("User not in cache, fetching from database");
            user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                }
            });

            if (!user) {
                logger.warn({ userId: decoded.userId }, 'User not found');
                return res.status(401).json({ error: 'Unauthorized: User not found' });
            }

            // await ensureConnected();
            await redisClient.set(`user:${user.id}`, JSON.stringify(user), { EX: 120 });

            logger.debug({ userId: decoded.userId }, 'User from database');
        }

        req.user = {
            userId: user.id,
        };

        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired' });
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        logger.error({ error }, 'Authentication failed');
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Clear cache on logout
export function clearUserCache(userId: string) {
    redisClient.del(`user:${userId}`).catch((error: any) => {
        logger.error({ error, userId }, 'Failed to clear user cache');
    });
}