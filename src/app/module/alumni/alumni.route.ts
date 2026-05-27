import { Router } from 'express';
import { AlumniController } from './alumni.controller';
import validationRequest from '../../middleware/validationRequest';
import { alumniValidation } from './alumni.validation';
import auth from '../../middleware/auth';

const router = Router();

// ── Public ──
router.get(
  '/mentors',                           
  AlumniController.getMentors,
);

// ── Alumni: own profile ──       
router.get(
  '/me',
  auth('alumni'),
  AlumniController.getMyProfile,
);

router.patch(
  '/me',
  auth('alumni'),
  validationRequest(alumniValidation.updateAlumniSchema),
  AlumniController.updateMyProfile,
);

router.patch(
  '/me/account',
  auth('alumni'),
  validationRequest(alumniValidation.updateAlumniLinkedSchema),
  AlumniController.updateMyLinkedData,
);

// ── Admin: all alumni ──
router.get(
  '/',
  auth('admin'),
  AlumniController.getAllAlumni,
);

// ── Shared: single alumni by studentId ──
router.get(
  '/:studentId',
  auth('alumni', 'admin'),
  AlumniController.getSingleAlumni,
);

// ── Admin: update any alumni ──
router.patch(
  '/:studentId',
  auth('admin'),
  validationRequest(alumniValidation.updateAlumniSchema),
  AlumniController.updateAlumni,
);

export const alumniRoutes = router;