import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {ACCESS_TOKEN, CURRENT_USER_ROLE} from "../config/constants";
import {AuthenticationRequest} from "../model/request/AuthenticationRequest";
import {AuthenticationResponse} from "../model/AuthenticationResponse";
import {AxiosResponse} from "axios";
import {UserRole} from "../model/enums/UserRole";

export const handleUserRegister = async (request: AuthenticationRequest) => {
    try {
        localStorage.setItem(ACCESS_TOKEN, '');
        const result = await axiosClient.post<AuthenticationResponse>(`/v1/auth/register`, request);
        const authenticationResponse = result.data;
        localStorage.setItem(ACCESS_TOKEN, authenticationResponse.token);
        localStorage.setItem(CURRENT_USER_ROLE, authenticationResponse.userRole);
        return authenticationResponse;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};

export const sendVerifyEmail = async (email: string) => {
    try {
        const response = await axiosClient.post(`/v1/auth/send-verify-email`, email);
        return response.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};

export const checkEmailExists = async (email: string) => {
    try {
        localStorage.setItem(ACCESS_TOKEN, '');
        const response = await axiosClient.post<boolean>(`/v1/auth/check-email-exists`, email);
        return response.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};

export const handleUserAuthenticate = async (authenticationRequest: AuthenticationRequest) => {
    try {
        localStorage.setItem(ACCESS_TOKEN, '');
        const result: AxiosResponse = await axiosClient.post<AuthenticationResponse>(`/v1/auth/authenticate`, authenticationRequest);
        const authenticationResponse = result.data;
        localStorage.setItem(ACCESS_TOKEN, authenticationResponse.token);
        localStorage.setItem(CURRENT_USER_ROLE, authenticationResponse.userRole);
        return authenticationResponse;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};
export const logout = async () => {
    try {
        const response = await axiosClient.get(`/v1/auth/logout`);
        localStorage.setItem(ACCESS_TOKEN, '');
        localStorage.setItem(CURRENT_USER_ROLE, UserRole.NULL);
        return response.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};
