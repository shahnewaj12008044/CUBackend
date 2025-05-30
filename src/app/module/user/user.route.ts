import { Router } from "express";
import { userController } from "./user.controller";
import validationRequest from "../../middleware/validationRequest";
import { studentalidations } from "../student/student.validation";


const router = Router();

router.post ("/signup-student",validationRequest(studentalidations.studentSignupValidationSchema), userController.signupStudent);


export const userRoutes = router;