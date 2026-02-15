import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    database: {
        url: process.env.DATABASE_URL || '',
    },
    clerk:{
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
        secretKey: process.env.CLERK_SECRET_KEY || '',
    },

    cors:{
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    }

}