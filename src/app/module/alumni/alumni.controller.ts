import httpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AlumniServices } from './alumni.service';

// ── Admin: get all alumni ──
const getAllAlumni = catchAsync(async (req: Request, res: Response) => {
  const result = await AlumniServices.getAllAlumniFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All alumni fetched successfully',
    data: result,
  });
});

// ── Anyone authed: get single alumni ──
const getSingleAlumni = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const result = await AlumniServices.getSingleAlumniFromDB(studentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Alumni fetched successfully',
    data: result,
  });
});

// ── Alumni: get own profile ──
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await AlumniServices.getMyProfileFromDB(req.user?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your profile fetched successfully',
    data: result,
  });
});

// ── Alumni: update own profile ──
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await AlumniServices.updateMyProfileInDB(
    req.user?.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your profile updated successfully',
    data: result,
  });
});

// ── Admin: update any alumni ──
const updateAlumni = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const result = await AlumniServices.updateAlumniFromDB(studentId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Alumni updated successfully',
    data: result,
  });
});

// ── Alumni: update own linked data (email/status) ──
const updateMyLinkedData = catchAsync(async (req: Request, res: Response) => {
  const result = await AlumniServices.updateAlumniLinkedDataFromDB(
    req.user?.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Account data updated successfully',
    data: result,
  });
});

// ── Public: get mentor list ──
const getMentors = catchAsync(async (req: Request, res: Response) => {
  const result = await AlumniServices.getMentorsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentors fetched successfully',
    data: result,
  });
});

export const AlumniController = {
  getAllAlumni,
  getSingleAlumni,
  getMyProfile,
  updateMyProfile,
  updateAlumni,
  updateMyLinkedData,
  getMentors,
};