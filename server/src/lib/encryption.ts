import crypto from 'crypto';

const ALGORITHM = 'aes-256-cfb';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const PBKDF2_ITERATIONS = 1000;


export const generateSalt = (): string => {
    return crypto.randomBytes(32).toString('base64');
}


export const deriveKey = (password: string, salt: string): Buffer => {
    return crypto.pbkdf2Sync(
        password,
        salt,
        PBKDF2_ITERATIONS,
        KEY_LENGTH,
        'sha256'
    );
}

export const encrypt = (
    plaintext: string,
    password: string,
    salt: string
): { encrypted: string; iv: string } => {
    const key = deriveKey(password, salt);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return {
        encrypted,
        iv: iv.toString('base64'),
    };
};


export const decrypt = (encryptedData: string,
    ivBase64: string,
    password: string,
    salt: string): string => {
    try {
        const key = deriveKey(password, salt);
        const iv = Buffer.from(ivBase64, 'base64');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        throw new Error(`Decryption failed: ${error}`);
    }
}