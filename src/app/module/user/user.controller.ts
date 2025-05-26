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

export const userController = {
  signupStudent,
};
