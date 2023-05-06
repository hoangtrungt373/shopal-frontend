import {ACCESS_TOKEN, CURRENT_USER_ROLE} from "../config/constants";
import {UserRole} from "../model/enums/UserRole";

export const isAuthenticated = () => {
    return localStorage.getItem(ACCESS_TOKEN);
}

export const isAuthenticatedByRole = (role: UserRole) => {
    return localStorage.getItem(ACCESS_TOKEN) && localStorage.getItem(CURRENT_USER_ROLE) == role;
}