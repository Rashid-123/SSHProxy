import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from '@/config/env';
import logger from './config/logger';
import routes from '@/routes/index';
import { errorHandler } from './middleware/errorHandler';
import type { AuthRequest } from './types/types';

const app: Express = express();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: config.cors.origin,
        credentials: true,
    })
);

app.use((req, res, next) => {
    logger.info(
        { method: req.method, path: req.path },
        'Incoming request'
    );
    next();
});

// Routes
app.use('/api', routes);

// Error handler 
app.use(errorHandler);

const PORT = config.port;

export const startServer = async () => {
    try {
        app.listen(PORT, () => {
            logger.info({ port: PORT }, 'Server started');
        });
    } catch (error) {
        logger.error({ error }, 'failed to start server');
        process.exit(1);
    }
}

export default app;