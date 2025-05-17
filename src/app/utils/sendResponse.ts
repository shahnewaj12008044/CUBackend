import { Response } from "express";


export type TResponse<T> = {
    statusCode: number;
    success: boolean;
    message: string;
    data:T;
}

export const sendResponses = <T>(res: Response, { statusCode, success, message, data }: TResponse<T>) => 
   res.status(statusCode).json({ success, message, data })


const sendResponse = <T>(
  res: Response,
  data: TResponse<T>
) => {
    res.status(data?.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
    })
};

 export default sendResponse;