import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validationRequest from "../../middleware/validationRequest";
import auth from "../../middleware/auth";

const router = Router();

router.post("/sign-in", AuthController.loginUser);


router.post(
  '/refresh-token',
  validationRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);

router.post(
  '/change-password/:studentId',
  auth("me"),
  validationRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
);


export const authRoutes = router;