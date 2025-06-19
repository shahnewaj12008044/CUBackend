import jwt from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import bcrypt from 'bcrypt';

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


export const isPasswordMatchedChecker = async (plainTextPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
