import prisma from '@/lib/prisma';
import { generateSalt } from '@/lib/encryption';
import logger from '@/config/logger';

export async function getOrCreateUser(clerkId: string, email: string, firstName?: string, lastName?: string) {

    let user = await prisma.user.findUnique({
        where: { clerkId },
    })

    if (!user) {
        logger.info({ clerkId, email }, 'creating new user');

        user = await prisma.user.create({
            data: {
                clerkId,
                email,
                firstName,
                lastName,
                encryptionSalt: generateSalt(),
            },
        });

        logger.info({ userId: user.id }, 'User created SuccessFully');
    } else {
        logger.debug({ userId: user.id }, 'User allready exists');
    }

    return user;
}


export const getUserById = async (userId: string) => {
     return prisma.user.findUnique({
        where: {id: userId},
     });
}

export const getUserByClerkId = async (clerkId: string) => {
    return prisma.user.findUnique({
        where:{clerkId},
    });
}
