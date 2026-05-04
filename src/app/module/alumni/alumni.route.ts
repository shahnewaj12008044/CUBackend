import { Router } from "express";
import { AlumniController } from "./alumni.controller";
import validationRequest from "../../middleware/validationRequest";
import { alumniValidation } from "./alumni.validation";
import auth from "../../middleware/auth";


const router = Router();

// alumni, teacher and admin can access all alumni data
router.get("/",auth("alumni","teacher","admin"),AlumniController.getAllAlumni);

// alumni, teacher and admin can access all alumni data
router.get("/:studentId",auth("alumni","teacher","admin"),AlumniController.getSingleAlumni);


// admin and the only alumni can update their own data
router.put("/:studentId",auth("me","admin"),validationRequest(alumniValidation.UpdateAlumniSchema),AlumniController.updateAlumni);

// admin and the only alumni can update their own data in all linked models
router.patch("/updateLinkedData/:studentId",auth("me","admin"),validationRequest(alumniValidation.UpdateAlumniSchema),AlumniController.updateAlumniLinkedData);


export const alumniRoutes = router;