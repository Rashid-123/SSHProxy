import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT ,
    nodeEnv: process.env.NODE_ENV ,
    jwtSecret: process.env.JWT_SECRET ,
    database: {
        url: process.env.DATABASE_URL ,
    },
    clerk:{
        publishableKey: process.env.CLERK_PUBLISHABLE_KEY ,
        secretKey: process.env.CLERK_SECRET_KEY ,
    },

    cors:{
        origin: process.env.FRONTEND_URL,
    }

}
