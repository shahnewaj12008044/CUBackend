import { Router } from "express";
import { userController } from "./user.controller";


const router = Router();

router.post ("/signup-student", userController.signupStudent);


export const userRoutes = router;