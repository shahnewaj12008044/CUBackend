import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { StudentServices } from './student.service';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Students fetched successfully',
    data: result,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single Student fetched successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const payload = req.body;
  const result = await StudentServices.updateStudentFromDB(studentId, payload);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});

const updateLinkedData = catchAsync(async (req, res) => {
  const { studentId } = req.params;

  const role = req.user?.role;
  
  const result = await StudentServices.updateLinkedDataFromDB(studentId,req.body, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student is updated in all linked models successfully',
    data: result,
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
 updateLinkedData,
};
