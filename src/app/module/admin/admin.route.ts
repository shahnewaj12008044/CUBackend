import express from 'express';
import multer from 'multer';
import auth from '../../middleware/auth';
import validationRequest from '../../middleware/validationRequest';
import { AdminController } from './admin.controller';
import { AdminValidations } from './admin.validation';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post(
  '/invite',
  auth('admin'),
  validationRequest(AdminValidations.inviteAdminValidationSchema),
  AdminController.inviteAdmin,
);

router.post(
  '/register',
  upload.single('profileImg'),
  validationRequest(AdminValidations.registerViaInviteValidationSchema),
  AdminController.registerViaInvite,
);

router.get('/', auth('admin'), AdminController.getAllAdmins);

router.get('/:adminId', auth('admin'), AdminController.getAdminById);

router.patch(
  '/me',
  auth('admin'),
  upload.single('profileImg'),
  validationRequest(AdminValidations.updateAdminValidationSchema),
  AdminController.updateMe,
);

router.delete('/:adminId', auth('admin'), AdminController.deleteAdmin);

router.get('/posts/all', auth('admin'), AdminController.getAllPosts);

router.get('/posts/pending', auth('admin'), AdminController.getPendingPosts);

router.patch('/posts/:postId/approve', auth('admin'), AdminController.approvePost);

router.patch(
  '/posts/:postId/reject',
  auth('admin'),
  validationRequest(AdminValidations.rejectPostSchema),
  AdminController.rejectPost,
);

router.delete('/posts/:postId', auth('admin'), AdminController.adminDeletePost);

export const AdminRoutes = router;
