import express from 'express';
import multer from 'multer';
import auth from '../../middleware/auth';
import validationRequest from '../../middleware/validationRequest';
import { StudentController } from './student.controller';
import { StudentValidations } from './student.validation';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.get('/', auth('admin'), StudentController.getAllStudents);

router.get(
  '/:studentId',
  auth('admin', 'student'),
  StudentController.getSingleStudent,
);

// Student updates their own personal/contact/portfolio info
router.patch(
  '/me',
  auth('student'),
  upload.single('profileImage'),
  validationRequest(StudentValidations.updateStudentProfileValidationSchema),
  StudentController.updateStudentProfile,
);

// Admin updates academic structure (session, department, faculty, studyInfo)
router.patch(
  '/:studentId',
  auth('admin'),
  validationRequest(StudentValidations.adminUpdateStudentValidationSchema),
  StudentController.adminUpdateStudent,
);

router.delete('/:studentId', auth('admin'), StudentController.deleteStudent);

export const StudentRoutes = router;
