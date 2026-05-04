import jwt from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status-codes';

export const createToken = (
  jwtPayload: { id?: string; email?: string; role: string },
  secret: string,
  expiresIn: jwt.SignOptions['expiresIn'],//!that updated version gave an type error that expires in expected number or string and i cant assign string here if i want to assign string it has to be convertable to number finally the typdefinition found from deepseek solved the problem
) => {
    
    
  return jwt.sign(jwtPayload, secret,{expiresIn});
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(401,
      "Invalid token, please login again !",
      error?.message || "Token verification failed" 
    )
  }
};

export const checkUserStatus = (user: {
  isDeleted: boolean;
  status: string;
}) => {
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User account is deleted');
  }

  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User account is blocked');
  }
};


export const isPasswordMatchedChecker = async (plainTextPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
