import {Router, Request , Response} from "express";
import authRoutes from './auth';
import machineRoutes from "./machine";
const router = Router();

router.get('/helth', (req: Request , res: Response ) => {
    res.json({status: 'ok'});
});

// Group of all routes
router.use('/auth', authRoutes);
router.use('/machine', machineRoutes);

export default router;