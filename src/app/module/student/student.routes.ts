import { Router } from "express";
import { StudentController } from "./student.controller";
import validationRequest from "../../middleware/validationRequest";
import { studentalidations } from "./student.validation";
import auth from "../../middleware/auth";


const router = Router();


//^alumni teacher admin can get the students info
router.get("/",auth("alumni","teacher","admin"),StudentController.getAllStudents);

//^alumni teacher admin and only the student  can get the student info

router.get("/:studentId",auth("alumni","teacher","admin","me"),StudentController.getSingleStudent);

//^ admin and only the student  can update the student info

router.put("/:studentId",auth("admin","me"),validationRequest(studentalidations.UpdateStudentSchema),StudentController.updateStudent);

//^ admin and only the student  can update the student info

router.patch("/updateLinkedData/:studentId",auth("admin","me"),validationRequest(studentalidations.updateLinkedDataSchema),StudentController.updateLinkedData);


export const studentRoutes = router;