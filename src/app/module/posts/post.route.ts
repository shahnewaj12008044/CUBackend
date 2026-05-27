import { Router } from 'express';
import auth from '../../middleware/auth';
import validationRequest from '../../middleware/validationRequest';
import { PostController } from './post.controller';
import { PostValidations } from './post.validation';


const router = Router();

// ── Create — student and alumni only (admin uses admin module) ──
router.post(
  '/',
  auth('student', 'alumni','admin'),
  validationRequest(PostValidations.createPostValidationSchema),
  PostController.createPost,
);

// ── Read — all authenticated roles ──
router.get(
  '/',
  auth('student', 'alumni', 'admin'),
  PostController.getAllPosts,
);

router.get(
  '/:postId',
  auth('student', 'alumni', 'admin'),
  PostController.getSinglePost,
);

// ── Update — student and alumni only (own post) ──
router.patch(
  '/:postId',
  auth('student', 'alumni'),
  validationRequest(PostValidations.updatePostValidationSchema),
  PostController.updatePost,
);

// ── Delete — student and alumni only (own post) ──
// admin delete is handled in admin module
router.delete(
  '/:postId',
  auth('student', 'alumni'),
  PostController.deletePost,
);

export const postRoutes = router;