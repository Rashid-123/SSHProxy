import {Router } from 'express';
import * as machineController from "@/controllers/machineController";
import { requiredMachineOwner } from '@/middleware/authorization';
import { authenticateFromCookie } from '@/middleware/auth';;

const router = Router();

router.use(authenticateFromCookie);

router.post('/', machineController.create);
router.get('/', machineController.list);


// check for ownership of machine
router.delete('/:id',requiredMachineOwner, machineController.remove);

export default router;