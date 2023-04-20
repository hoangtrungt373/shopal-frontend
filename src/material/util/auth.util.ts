import {ACCESS_TOKEN} from "../config/constants";

export const isAuthenticated = () => {
    return localStorage.getItem(ACCESS_TOKEN);
}
