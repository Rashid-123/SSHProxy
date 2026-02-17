import { Request, Response } from "express";
import jwt from "jsonwebtoken";


import { verifyToken } from "@clerk/backend";
import { config } from "@/config/env";
import { getOrCreateUser, getUserById } from "@/services/userService";
import logger from "@/config/logger";
import type { AuthRequest, ClerkJWTPayload } from "@/types/types";

// single controller for login/register

export const handleClerkAuth = async (req: Request, res: Response) => {
    try {
        console.log("---AUTH controller -------")
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: 'Token required' });
        }

        // verify token with Clerk
        const verified = await verifyToken(token, {
            secretKey: config.clerk.secretKey,
        }) as ClerkJWTPayload;


        const clerkId = verified.sub;
        const email = verified.email ?? "";
        const firstName = verified.given_name ?? "";
        const lastName = verified.family_name ?? "";

        // logger.info({ clerkId, email }, 'Auth request received');
        
          
        // Get or Create user
        const user = await getOrCreateUser(clerkId, email, firstName, lastName);
          
        const appToken = jwt.sign(
            {
                userId: user.id,
            },
            config.jwtSecret,
            { expiresIn: "1d" }
        );

        console.log(appToken)

        // set httpOnly cookie
        res.cookie('auth_token', appToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'lax',
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 DAYS
            path: '/',
        });

        // logger.info({ userId: user.id }, 'Auth successful');

        console.log("---- successfully authenticated -----------")
       
        res.status(200).json({
            status: 'success',
            user: {
                id: user.id,
                clerkId: user.clerkId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });

    } catch (error) {
        logger.error({ error }, 'Auth error');
        res.status(401).json({ error: 'Authenticaton failed' });
    }
}

// -------- Get current user  ----------

export async function getCurrentUser(req: AuthRequest, res: Response) {
    try {
        console.log("-------inside the get user controller --------")
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // User already verified by auth middleware
        // Just fetch from database
        const user = await getUserById(req.user.userId);
        
        if (!user) {
            res.clearCookie('auth_token');
            return res.status(401).json({ error: 'User not found' });
        }

        // logger.debug({ userId: user.id }, 'User verified');
        console.log("---- user response ready for get user ----------")
        res.status(200).json({
            status: 'success',
            user: {
                id: user.id,
                clerkId: user.clerkId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error) {
        logger.error({ error }, 'Get user error');
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}


//--------- Logout user -------------

export function logout(req: Request, res: Response) {
    console.log("-------request received for logout --------")
    res.clearCookie('auth_token');

    // logger.info('User logged out');

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
}