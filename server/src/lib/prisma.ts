import { PrismaClient }  from "@prisma/client";
import logger from "@/config/logger";

const prisma = new PrismaClient();

prisma.$connect().then( () => {
    logger.info('Database connected successfully');
});

export default prisma;

