import { Response, NextFunction } from "express";
import type { AuthRequest } from "@/types/types";
import prisma from "@/lib/prisma";


// --------- Check if user owns the resource ( machine ) -----------

export const requiredMachineOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const machineId = req.params.id as string;

        const machine = await prisma.machine.findUnique({
            where: { id: machineId },
            select: { ownerId: true }
        });

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' })
        }

        // check if user owns the machine
        if (machine.ownerId !== req.user.userId) {
            return res.status(403).json({ error: 'Forbidden : Access denied' })
        }

        next();
        
    } catch (error: any) {
        console.error({error} , 'Authorization check failed');
        res.status(500).json({error: 'Authorization check failed'})
    }
}