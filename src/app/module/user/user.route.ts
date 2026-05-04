import express from 'express';
import auth from '../../middleware/auth';

import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';
import validationRequest from '../../middleware/validationRequest';

const router = express.Router();

router.get('/', auth('admin'), UserControllers.getAllUsers);
router.get('/:id', auth('admin'), UserControllers.getSingleUser);

router.patch(
  '/me/account',
  auth('student', 'teacher', 'alumni', 'admin'),
  validationRequest(UserValidations.updateMyAccountValidationSchema),
  UserControllers.updateMyAccount,
);

router.patch(
  '/me/change-password',
  auth('student', 'teacher', 'alumni', 'admin'),
  validationRequest(UserValidations.changePasswordValidationSchema),
  UserControllers.changePassword,
);

router.patch(
  '/:id',
  auth('admin'),
  validationRequest(UserValidations.adminUpdateUserValidationSchema),
  UserControllers.adminUpdateUser,
);

router.delete('/:id', auth('admin'), UserControllers.softDeleteUser);

export const UserRoutes = router;