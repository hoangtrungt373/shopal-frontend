import {UserRole} from "./enums/UserRole";

export interface AuthenticationResponse {
    token: string;
    userRole: UserRole;
}
