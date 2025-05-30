import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const statusCode = 400;

   // Extract value within double quotes using regex
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const match = (err as any)?.stack?.errorResponse?.errmsg.match(/"([^"]*)"/);
   //^ explanation of the match here the errmsg is something else from that we just extact the duplicate id

   // The extracted value will be in the first capturing group
   const extractedMessage = match && match[1];
 
  const errorSources: TErrorSources = [
    { path: '', message:`${extractedMessage} is already exist`  },
  ];
  return {
    statusCode,
    message: 'Duplicate data error',
    errorSources,
  };
};
export default handleDuplicateError;


