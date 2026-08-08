import express from 'express';
import multer from 'multer';
import { AuthControllers } from './auth.controller';

import { AuthValidations } from './auth.validation';
import validationRequest from '../../middleware/validationRequest';
import { alumniValidation } from '../alumni/alumni.validation';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });


router.post(
  '/signup/student',
  upload.single('profileImage'),
  validationRequest(AuthValidations.registerStudentValidationSchema),
  AuthControllers.registerStudent,
);


router.post(
  '/signup/alumni',
  validationRequest(alumniValidation.createAlumniSchema),
  AuthControllers.registerAlumni,
);

// router.post(
//   '/signup/admin',
//   auth('admin'),
//   validationRequest(AdminValidations.createAdminValidationSchema),AuthControllers.createAdmin,
// );

router.post(
  '/login',
  validationRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/refresh-token',
  AuthControllers.refreshToken,
);


//! not tested yet

router.post(
  '/forgot-password',
  validationRequest(AuthValidations.forgotPasswordValidationSchema),
  AuthControllers.forgotPassword,
);

router.post(
  '/reset-password',
  validationRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;