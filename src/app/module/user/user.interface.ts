
export interface IUser {
    id: string;
    email: string;
    password: string; //!password has to be hashed
    passwordChangedAt: Date;
    role: "student" | "teacher" | "alumni" ;
    status: "in-progress" | "blocked";
    isDeleted: boolean;
}

//! role : "superadmin" | "departmentadmin" | "facultyadmin"; i would rather use them as post of the club 