import { Router } from "express";
import { userController } from "./user.controller";
import validationRequest from "../../middleware/validationRequest";
import { studentalidations } from "../student/student.validation";
import { alumniValidation } from "../alumni/alumni.validation";


const router = Router();

router.post ("/signup-student",validationRequest(studentalidations.studentSignupValidationSchema), userController.signupStudent);
router.post ("/signup-alumni",validationRequest(alumniValidation.alumniSignupValidationSchema), userController.signupAlumni);
router.put("/:studentId", userController.updateUserData);


export const userRoutes = router;