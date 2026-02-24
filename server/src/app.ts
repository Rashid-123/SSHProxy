import 'dotenv/config';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import { setupWebSocketServer } from './websocket';
import { config } from '@/config/env';
//
import { connectRedis, redisClient } from './config/redisClient';
//
import cors from 'cors';
import logger from './config/logger';
import routes from '@/routes/index';
import { errorHandler } from './middleware/errorHandler';

const app: Express = express();

// middleware
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: 'SSHProxy Backend is running smoothly'
    });
});


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

        await connectRedis();
        logger.info('Redis connection established successfully');

        const server = http.createServer(app);

        // Setup WebSocket server
        setupWebSocketServer(server);

        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });

        // Graceful Shutdown - Crucial for Docker/Build environments
        process.on('SIGINT', async () => {
            await redisClient.quit();
            process.exit(0);
        });
    } catch (error) {
        logger.error({ error }, 'failed to start server');
        process.exit(1);
    }
}

startServer();

export default app;