import jwt from 'jsonwebtoken';


export const createToken = (
  jwtPayload: { id?: string; email?: string; role: string },
  secret: string,
  expiresIn: jwt.SignOptions['expiresIn'],//!that updated version gave an type error that expires in expected number or string and i cant assign string here if i want to assign string it has to be convertable to number finally the typdefinition found from deepseek solved the problem
) => {
    
    
  return jwt.sign(jwtPayload, secret,{expiresIn});
};
