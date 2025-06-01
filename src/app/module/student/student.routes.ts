import { Router } from "express";
import { StudentController } from "./student.controller";
import validationRequest from "../../middleware/validationRequest";
import { studentalidations } from "./student.validation";


const router = Router();

router.get("/",StudentController.getAllStudents);
router.get("/:studentId",StudentController.getSingleStudent);
router.put("/:studentId",validationRequest(studentalidations.UpdateStudentSchema),StudentController.updateStudent);
router.patch("/updateLinkedData/:studentId",validationRequest(studentalidations.updateLinkedDataSchema),StudentController.updateLinkedData);


export const studentRoutes = router;