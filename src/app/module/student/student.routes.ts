// ✅ Removed: /me/linked route — email/status updates belong in User routes
// ✅ Split: PATCH into /:studentId/profile and /:studentId/academic
// ✅ Role guards are the ONLY access control needed — no service-layer checks

import express from 'express';
import auth from '../../middleware/auth';
import validationRequest from '../../middleware/validationRequest';
import { StudentController } from './student.controller';
import { StudentValidations } from './student.validation';

const router = express.Router();

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