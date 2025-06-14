import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/sign-in", AuthController.loginUser);

export const authRoutes = router;