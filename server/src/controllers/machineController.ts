import { Response } from "express";
import {
  createMachine,
  deleteMachine,
  getMachinesBasicInfo,
} from "@/services/machineService";
import type { AuthRequest } from "@/types/types";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


// ----------------- Create Machine -----------------------------
export const create = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(req.user)

    const {
      name,
      hostname,
      port = 22,
      username,
      privateKey,
      passphrase,
      password,
    } = req.body;
    console.log(name, hostname, username, privateKey, password)

    if (!name || !hostname || !username || !privateKey || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const machine = await createMachine(req.user.userId, {
      name,
      hostname,
      port,
      username,
      privateKey,
      passphrase,
      password,
    });

    res.status(201).json({
      status: "success",
      data: {
        id: machine.id,
        name: machine.name,
        hostname: machine.hostname,
      },
    });
  } catch (err: any) {

    console.error({ err }, "Create machine error");

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          error: "Machine name already exists for this user",
        });
      }
    }

    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }

    return res.status(500).json({ error: "Unknown error" });
  }
};

// ----------------- List Machines -----------------------------
export const list = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const machines = await getMachinesBasicInfo(req.user.userId);

    res.status(200).json({
      status: "success",
      data: machines,
    });
  } catch (error) {
    console.error({ error }, "List machine error");

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};

// ----------------- Delete Machine -----------------------------
export const remove = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const id = req.params.id as string;

    await deleteMachine(id, req.user.userId);

    console.log("-------- Machine deleted --------");

    res.status(200).json({
      status: "success",
      message: "Machine deleted",
    });
  } catch (error) {
    console.error({ error }, "Delete machine error");

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};


// ---------------------- Get individaul machine ---------------------

export const getMachine = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const id = req.params.id as string;

    const machine = await prisma.machine.findFirst({
      where: {
        id,
        ownerId: req.user.userId,
      },
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

    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }

    res.status(200).json({
      status: "success",
      data: machine,
    });
  } catch (error) {
    console.error({ error }, "Get machine error");

    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};