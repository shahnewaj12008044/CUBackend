import { Router } from "express";
import { AlumniController } from "./alumni.controller";
import validationRequest from "../../middleware/validationRequest";
import { alumniValidation } from "./alumni.validation";


const router = Router();

router.get("/",AlumniController.getAllAlumni);
router.get("/:studentId",AlumniController.getSingleAlumni);
router.put("/:studentId",validationRequest(alumniValidation.UpdateAlumniSchema),AlumniController.updateAlumni);
router.patch("/updateLinkedData/:studentId",AlumniController.updateAlumniLinkedData);


export const alumniRoutes = router;