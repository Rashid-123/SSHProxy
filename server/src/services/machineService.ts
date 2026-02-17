import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";
import type { CreateMachineInput } from "@/types/types";

// ----------------- Create Machine -----------------------------
export const createMachine = async (
    userId: string,
    input: CreateMachineInput
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const salt = user.encryptionSalt;

    // Encrypt private key
    const { encrypted: encryptedPrivateKey, iv: ivPrivateKey } = encrypt(
        input.privateKey,
        input.password,
        salt
    );

    // Encrypt passphrase if exists
    let encryptedPassphrase = "";
    let ivPassphrase = "";

    if (input.passphrase) {
        const result = encrypt(input.passphrase, input.password, salt);
        encryptedPassphrase = result.encrypted;
        ivPassphrase = result.iv;
    }

    const machine = await prisma.machine.create({
        data: {
            name: input.name,
            hostname: input.hostname,
            port: input.port,
            username: input.username,
            encryptedPrivateKey,
            ivPrivateKey,
            encryptedPassphrase,
            ivPassphrase,
            owner: {
                connect: { id: userId },
            },
        },
    });

    console.log("------ Machine created ----------");

    return machine;
};

// ----------------- List Machines -----------------------------
export const getMachinesBasicInfo = async (userId: string) => {
    return prisma.machine.findMany({
        where: { ownerId: userId },
        select: {
            id: true,
            name: true,
            hostname: true,
            port: true,
            username: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

// ----------------- Delete Machine -----------------------------
export const deleteMachine = async (
    machineId: string,
    userId: string
) => {
    const machine = await prisma.machine.findUnique({
        where: { id: machineId },
    });

    if (!machine) {
        throw new Error("Machine not found");
    }

    if (machine.ownerId !== userId) {
        throw new Error("Access denied");
    }

    return prisma.machine.delete({
        where: { id: machineId },
    });
};
