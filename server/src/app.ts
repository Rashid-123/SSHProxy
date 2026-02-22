import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
 import http from 'http';
import { setupWebSocketServer } from './websocket';
import cors from 'cors';
import { config } from '@/config/env';
import logger from './config/logger';
import routes from '@/routes/index';
import { errorHandler } from './middleware/errorHandler';

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

       const server = http.createServer(app);

        // Setup WebSocket server
        setupWebSocketServer(server);
        
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error({ error }, 'failed to start server');
        process.exit(1);
    }
}

startServer();

export default app;