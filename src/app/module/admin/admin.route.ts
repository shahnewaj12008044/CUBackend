// src/modules/admin/admin.route.ts

import express from 'express';
import auth from '../../middleware/auth';
import validationRequest from '../../middleware/validationRequest';
import { AdminController } from './admin.controller';
import { AdminValidations } from './admin.validation';

const router = express.Router();

// Invite — only system_admin can send invites ✔
//* all routes but the register via invite route are tested 
router.post(
  '/invite',
  auth('admin'),
  validationRequest(AdminValidations.inviteAdminValidationSchema),
  AdminController.inviteAdmin,
);

// Register via token — completely public, no auth needed
// The token itself IS the authentication //! will be checked after frontend sends the token in the request body
router.post(
  '/register',
  validationRequest(AdminValidations.registerViaInviteValidationSchema),
  AdminController.registerViaInvite,
);

router.get(
  '/',
  auth('admin'),
  AdminController.getAllAdmins,
);

router.get(
  '/:adminId',
  auth('admin'),
  AdminController.getAdminById,
);
router.patch(
  '/me',
  auth('admin'),
  validationRequest(AdminValidations.updateAdminValidationSchema),
  AdminController.updateMe,
);

// router.patch(
//   '/:adminId',
//   auth('admin'),
//   validationRequest(AdminValidations.updateAdminValidationSchema),
//   AdminController.updateAdmin,
// );

router.delete(
  '/:adminId',
  auth('admin'),
  AdminController.deleteAdmin,
);

export const AdminRoutes = router;