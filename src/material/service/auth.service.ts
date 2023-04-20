import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {ACCESS_TOKEN} from "../config/constants";
import {CustomerRegisterRequest} from "../model/form/CustomerRegisterRequest";
import {AuthenticationRequest} from "../model/form/AuthenticationRequest";
import {AuthenticationResponse} from "../model/AuthenticationResponse";
import {AxiosResponse} from "axios";

export const register = async (customerRegisterRequest: CustomerRegisterRequest) => {
    try {
        localStorage.setItem(ACCESS_TOKEN, '');
        const response = await axiosClient.post(`/v1/auth/register`, customerRegisterRequest);
        return response.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};
export const authenticate = async (authenticationRequest: AuthenticationRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<AuthenticationResponse>(`/v1/auth/authenticate`, authenticationRequest);
        const authenticationResponse = result.data;
        localStorage.setItem(ACCESS_TOKEN, authenticationResponse.token);
        console.log(authenticationResponse);
        return authenticationResponse;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};
export const logout = async () => {
    try {
        const response = await axiosClient.get(`/v1/auth/logout`);
        localStorage.setItem(ACCESS_TOKEN, '');
        return response.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};
