import {UserRole} from "../enums/UserRole";

export interface AuthenticationRequest {
    email?: string | any,
    password?: string | any,
    conformPassword?: string | any,
    guiOtp?: string,
    serverOtp?: string,
    role?: UserRole,
}
