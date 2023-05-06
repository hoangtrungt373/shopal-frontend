import {UserRole} from "../enums/UserRole";

export interface CustomerRegisterRequest {
    email: string | any;
    password: string | any;
    conformPassword?: string | any;
    role: UserRole;
}
