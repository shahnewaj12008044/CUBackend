import express from 'express';
import { AuthControllers } from './auth.controller';

import { AuthValidations } from './auth.validation';
import validationRequest from '../../middleware/validationRequest';
// import { AdminValidations } from '../admin/admin.validation';
// import auth from '../../middleware/auth';

const router = express.Router();


router.post(
  '/signup/student',
  validationRequest(AuthValidations.registerStudentValidationSchema),
  AuthControllers.registerStudent,
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