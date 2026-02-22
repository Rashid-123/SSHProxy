import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 100000;


export const generateSalt = (): string => {
    return crypto.randomBytes(32).toString('base64');
}


export const deriveKey = (password: string, salt: string): Buffer => {
    return crypto.pbkdf2Sync(
        password,
        Buffer.from(salt, "base64"),
        PBKDF2_ITERATIONS,
        KEY_LENGTH,
        "sha256"
    );
}

export const encrypt = (
    plaintext: string,
    password: string,
    salt: string
): { encrypted: string; iv: string; authTag: string } => {
    const key = deriveKey(password, salt);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag().toString('base64');

    return {
        encrypted,
        iv: iv.toString('base64'),
        authTag
    };
};


export const decrypt = (encryptedData: string,
    ivBase64: string,
    password: string,
    salt: string,
    authTag: string): string => {
    try {
        const key = deriveKey(password, salt);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivBase64, 'base64'));

        decipher.setAuthTag(Buffer.from(authTag, 'base64'));

        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');  // This will throw an error if authentication fails

        return decrypted;
    } catch (error) {
        throw new Error(`Decryption failed: ${error}`);
    }
}