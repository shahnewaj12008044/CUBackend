/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { IStudent } from "../module/student/student.interface";
import AppError from "../errors/AppError";
import httpStatus from "http-status-codes";

const validatePayloadKeys = (payload: Partial<IStudent>, model: mongoose.Model<any>, modelName: string) => {
  const schemaPaths = Object.keys(model.schema.paths);
  const invalidKeys = Object.keys(payload).filter(key => !schemaPaths.includes(key));
    
  if (invalidKeys.length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid field(s) for ${modelName}: ${invalidKeys.join(', ')}`);
  }
};

export default validatePayloadKeys;