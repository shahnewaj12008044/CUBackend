// src/modules/admin/admin.controller.ts

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';
import httpStatus from 'http-status-codes';




const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB(req.query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All admins fetched successfully',
    data: result,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const { adminId } = req.params;

  const result = await AdminServices.getAdminByIdFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin fetched successfully',
    data: result,
  });
});

// const updateAdmin = catchAsync(async (req, res) => {
//   const { adminId } = req.params;
//   const { admin: adminData } = req.body;

//   const result = await AdminServices.updateAdminInDB(adminId, adminData);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Admin updated successfully',
//     data: result,
//   });
// });

const updateMe = catchAsync(async (req, res) => {
  const result = await AdminServices.updateMeInDB(req.user?.id, req.body.admin);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin profile updated successfully',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;

  const result = await AdminServices.deleteAdminFromDB(adminId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin deleted successfully',
    data: result,
  });
});
const inviteAdmin = catchAsync(async (req, res) => {
  const inviterCustomId = req.user?.id; // "ADM-2025-002" — custom string id
  const { email } = req.body;

  const result = await AdminServices.inviteAdminIntoDB(inviterCustomId, email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const registerViaInvite = catchAsync(async (req, res) => {
  const result = await AdminServices.registerAdminViaInviteIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin registered successfully',
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  getAdminById,
  // updateAdmin,
  deleteAdmin,
  inviteAdmin,
  registerViaInvite,
  updateMe
};