import { Router } from "express";

import * as authController from "@/controllers/authController";
import { authenticateFromCookie } from "@/middleware/auth";

const router = Router();

// public router
router.post('/', authController.handleClerkAuth);    
router.post('/logout',authenticateFromCookie , authController.logout);

router.get('/me', authenticateFromCookie, authController.getCurrentUser)

export default router;