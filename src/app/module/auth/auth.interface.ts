import { IStudent } from "../student/student.interface";

export interface ILoginUser {
  id?: string;
  email?: string;
  password: string;
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}
type TStudentSignupData = Omit<IStudent, 'userId'>;

export interface IRegisterStudent {
  email: string;
  password: string;
  student: TStudentSignupData;
}