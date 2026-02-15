import { Request } from "express";


export interface User {
    id: string;
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    encryptionSalt: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthRequest extends Request {
    
    user?: {
        userId: string;
        email: string;
    };
}

export interface ClerkJWTPayload {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
}