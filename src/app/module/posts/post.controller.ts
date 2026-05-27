// src/modules/post/post.controller.ts

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';
import httpStatus from 'http-status-codes';

// ─── CREATE ───────────────────────────────────────────────────────────────────

const createPost = catchAsync(async (req, res) => {
  const customUserId = req.user?.id;

  const result = await PostServices.createPostIntoDB(customUserId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post submitted for approval',
    data: result,
  });
});

// ─── GET ALL ──────────────────────────────────────────────────────────────────

const getAllPosts = catchAsync(async (req, res) => {
  const userRole = req.user?.role;

  const result = await PostServices.getAllPostsFromDB(req.query, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Posts fetched successfully',
    data: result,
  });
});

// ─── GET PENDING (admin only) ─────────────────────────────────────────────────

const getPendingPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getPendingPostsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pending posts fetched successfully',
    data: result,
  });
});

// ─── GET SINGLE ───────────────────────────────────────────────────────────────

const getSinglePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const userRole = req.user?.role;

  const result = await PostServices.getSinglePostFromDB(postId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post fetched successfully',
    data: result,
  });
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────

const updatePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const customUserId = req.user?.id;

  const result = await PostServices.updatePostInDB(postId, customUserId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated and resubmitted for approval',
    data: result,
  });
});

// ─── DELETE ───────────────────────────────────────────────────────────────────

const deletePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const customUserId = req.user?.id;
  const userRole = req.user?.role;

  await PostServices.deletePostFromDB(postId, customUserId, userRole);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post deleted successfully',
    data: null,
  });
});

export const PostController = {
  createPost,
  getAllPosts,
  getPendingPosts,
  getSinglePost,
  updatePost,
  deletePost,
};