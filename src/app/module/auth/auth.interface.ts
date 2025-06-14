
export interface ILoginUser {
    id?:string;
    email ?: string;
    password: string;
}


export  interface IJwtPayload {
    id?: string;
    email?: string;
    role: string;
}