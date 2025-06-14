import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { AuthService } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserIntoDB(req.body);
  const { accessToken, refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'none',
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User login successfully',
    data: accessToken,
  });
});

export const AuthController = {
  loginUser,
};
