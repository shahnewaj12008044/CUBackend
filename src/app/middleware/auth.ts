import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import { TUserRole } from '../module/user/user.interface';
import httpStatus from 'http-status-codes';
import AppError from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../module/user/user.model';


const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    //checking if the token is given or not
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    //checking if the token is valid or not
    // invalid token

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id,email, role, iat } = decoded;

    const user = await User.isUserExist(email);
    //! this is serious bug 
    //* the bug is i am doing me route to  validate the user if the user email is same as the token mail but i am getting the user mail from the token mail which is always same as the token mail. so instead of geeting from decoded i get it from req.params


    //checking if the user is exist

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!!!');
    }
    //checing if the user is dieleted

    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This User is Deleted Already');
    }
    //cheking if the user is blocked

    if ( user?.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!!!');
    }


    //* deactivating the previous token after the password been changed
    if (
      user.passwordChangedAt &&
      (await User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number
      ))
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You Session has ended!! Please Login again');
    }

    //checking if the role from the token is same as the role from the permitted roles
    // Check if the user has the required roles
    const isRoleValid = requiredRoles && requiredRoles.includes(role);

    const requestedId = req.params.studentId;
    // console.log("reqId", reqId);



    //~ this will compare if the requested id is same as the token id 
    const isAccessingOwnData = requiredRoles.includes("me") && requestedId === id;

    // console.log("isRoleValid", isRoleValid);
    // console.log(requestedId, decoded.id);  
    if (!isRoleValid && !isAccessingOwnData) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
     
    // console.log(decoded)
    //* this req.user is to send decoded in every request and the decoded data is sent to every request to do this there is a type definition in interface index.d.ts
    req.user = decoded as JwtPayload;
    next();



    //! there will be a position based authentication in the future






  });
};

export default auth;
