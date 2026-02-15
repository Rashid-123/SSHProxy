import crypto from 'crypto';

export function generateSalt() : string {
    return crypto.randomBytes(32).toString('base64');
}