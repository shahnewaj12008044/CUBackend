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


// ─── Post moderation ──────────────────────────────────────────────────────────
router.get(
  '/posts/all',
  auth('admin'),
  AdminController.getAllPosts,
);

router.get(
  '/posts/pending',
  auth('admin'),
  AdminController.getPendingPosts,
);

router.patch(
  '/posts/:postId/approve',
  auth('admin'),
  AdminController.approvePost,
);

router.patch(
  '/posts/:postId/reject',
  auth('admin'),
  validationRequest(AdminValidations.rejectPostSchema),
  AdminController.rejectPost,
);

router.delete(
  '/posts/:postId',
  auth('admin'),
  AdminController.adminDeletePost,
);

export const AdminRoutes = router;