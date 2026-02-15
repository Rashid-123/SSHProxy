import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { config } from '@/config/env';
import logger from '@/config/logger';
import type { AuthRequest } from '@/types/types';

/**
 * VERIFICATION MIDDLEWARE
 * Verifies the httpOnly cookie token
 * Runs on all protected routes
 */
export async function authenticateFromCookie(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.cookies.auth_token;

        if (!token) {
            logger.warn('No auth token in request');
            return res.status(401).json({ error: 'Unauthorized: No token' });
        }

        // Verify token with Clerk
        const decoded = await verifyToken(token, {
            secretKey: config.clerk.secretKey,
        });

        // Attach user to request
        req.user = {
            userId: decoded.sub || '',
            email: typeof decoded.email === "string"? decoded.email : '',
        };

        logger.debug({ userId: req.user.userId }, 'Token verified');
        next();
    } catch (error) {
        logger.error({ error }, 'Token verification failed');
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}