import {UserRole} from "../enums/UserRole";

export interface AuthenticationRequest {
    email: string | any;
    password: string | any;
    role: UserRole;
}
