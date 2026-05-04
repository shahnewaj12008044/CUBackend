import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.services';
import AppError from '../../errors/AppError';


const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (_req, res) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const updateMyAccount = catchAsync(async (req, res) => {
  const userId = req.user!.id;

  const result = await UserServices.updateMyAccountInDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account updated successfully',
    data: result,
  });
});

const adminUpdateUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.adminUpdateUserInDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const softDeleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.softDeleteUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
  throw new AppError(httpStatus.BAD_REQUEST, 'Old password and new password are required');
}

  await UserServices.changePasswordInDB(userId, oldPassword, newPassword);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: null,
  });
});

export const UserControllers = {
  getSingleUser,
  getAllUsers,
  updateMyAccount,
  adminUpdateUser,
  softDeleteUser,
  changePassword,
};