
export interface IUser {
    id: string;
    email: string;
    password: string; //!password has to be hashed
    passwordChangedAt: Date;
    role: "student" | "teacher" | "superadmin" | "departmentadmin" | "facultyadmin";
    status: "in-progress" | "blocked";
    isDeleted: boolean;
}
