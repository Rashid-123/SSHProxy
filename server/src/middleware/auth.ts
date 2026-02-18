import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { config } from '@/config/env';
import logger from '@/config/logger';
import type { AuthRequest } from '@/types/types';
import prisma from '@/lib/prisma';

// Simple in-memory cache (further use Redis)
const userCache = new Map<string, { user: any; expires: number }>();

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
        const cached = userCache.get(decoded.userId);
        const now = Date.now();

        let user;

        if (cached && cached.expires > now) {
            // Use cached user
            user = cached.user;
            logger.debug({ userId: decoded.userId }, 'User from cache');
        } else {
            // Query database
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


            // Cache for 2 minutes
            userCache.set(decoded.userId, {
                user,
                expires: now + (2 * 60 * 1000)
            });

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
    userCache.delete(userId);
}