import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { config } from '@/config/env';
import logger from '@/config/logger';
import type { AuthRequest } from '@/types/types';

// Verifies the httpOnly cookie token Runs on all protected routes
 
export async function authenticateFromCookie(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.cookies?.auth_token;
        console.log("-------- inside the authmiddleware -------------")
        if (!token) {
            logger.warn('No auth token in request');
            return res.status(401).json({ error: 'Unauthorized: No token' });
        }

        // Verify token 
        const decoded = jwt.verify(token, config.jwtSecret) as {
            userId: string;
        };

        req.user = {
            userId: decoded.userId,
        }; 

        console.log(req.user)

        // logger.debug({ userId: req.user.userId }, 'Token verified');

        next();

    } catch (error) {
        logger.error({ error }, 'Token verification failed');
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
}