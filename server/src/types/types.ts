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

export interface Machine {
  id: string;
  name: string;
  hostname: string;
  port: number;
  username: string;
  encryptedPrivateKey: string;
  ivPrivateKey: string;
  encryptedPassphrase?: string;
  ivPassphrase?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}



export interface CreateMachineInput {
  name: string;
  hostname: string;
  port: number;
  username: string;
  privateKey: string;
  passphrase?: string;
  password: string;
}


export interface AuthRequest extends Request {
    
    user?: {
        userId: string;
    };
}

export interface ClerkJWTPayload {
  sub: string;
  email?: string;
  given_name?: string;
  family_name?: string;
}