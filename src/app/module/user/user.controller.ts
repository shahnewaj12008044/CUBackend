import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpstatus from 'http-status-codes';
import { userServices } from './user.services';

const signupStudent = catchAsync(async (req, res) => {
  const { password, student} = req.body;
//   console.log(req.body)
// console.log(password, student)
  const result = await userServices.signupStudentIntoDB(password, student);
  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'student  created successfully',
    data: result,
  });
});


const signupAlumni = catchAsync(async (req, res) => {
  const { password, alumni} = req.body;
//   console.log(req.body)
// console.log(password, student)
  const result = await userServices.signupAlumniIntoDB(password, alumni);
  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'Alumni created successfully',
    data: result,
  });
});

const updateUserData = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const userData  = req.body;
  const result = await userServices.updateUserDataIntoDB(studentId, userData);
  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: 'User data updated successfully',
    data: result,
  });
});

export const userController = {
  signupStudent,
  signupAlumni,
  updateUserData,

};
