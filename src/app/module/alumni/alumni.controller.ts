import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AlumniServices } from "./alumni.service";

const getAllAlumni = catchAsync(async (req, res) => {
    const result = await AlumniServices.getAllAlumniFromDB();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All Alumni fetched successfully',
        data: result
    })

});

const getSingleAlumni = catchAsync(async (req, res) => {
    const {studentId} = req.params;
    const result = await AlumniServices.getSingleAlumniFromDB(studentId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Single Alumni fetched successfully',
        data: result
    })

});

const updateAlumni = catchAsync(async (req, res) => {
    const {studentId} = req.params;
    const payload = req.body;
    const result = await AlumniServices.updateAlumniFromDB(studentId, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Alumni updated successfully',
        data: result
    })

});

const updateAlumniLinkedData = catchAsync(async (req, res) => {
    const {studentId} = req.params;
    const result = await AlumniServices.updateAlumniLinkedDataFromDB(studentId, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Alumni data is updated in all linked models successfully',
        data: result
    })

});



export const AlumniController = {
    getAllAlumni,
    getSingleAlumni,
    updateAlumni,
   updateAlumniLinkedData,
}