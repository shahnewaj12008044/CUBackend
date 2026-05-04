import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status-codes';

import AppError from '../errors/AppError';
import config from '../config';
import catchAsync from '../utils/catchAsync';
import { TUserRole } from '../module/user/user.interface';
import { User } from '../module/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const authorizationToken = req.headers.authorization;

    if (!authorizationToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const token = authorizationToken.startsWith('Bearer ')
      ? authorizationToken.split(' ')[1]
      : authorizationToken;

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { id, email, role, iat } = decoded;

    const user = await User.findOne({ id });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
    }

    if (user.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked');
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Your session has expired. Please log in again.',
      );
    }

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not allowed to access this route',
      );
    }

    req.user = {
      id,
      email,
      role,
    };

    next();
  });
};

export default auth;