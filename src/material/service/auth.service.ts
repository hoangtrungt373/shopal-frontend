import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ProductDetail} from "../model/ProductDetail";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {AuthenticationRequest} from "../model/AuthenticationRequest";
import {ACCESS_TOKEN} from "../config/constants";

export const registerApi = async (authenticationRequest: AuthenticationRequest) => {
    try {
        const response = await axiosClient.post(`/api/v1/auth/register`, authenticationRequest);
        return response.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};
export const loginApi = async (authenticationRequest: AuthenticationRequest) => {
    try {
        const response = await axiosClient.post(`/api/v1/auth/authenticate`, authenticationRequest);
        const token = response.data;
        localStorage.setItem(ACCESS_TOKEN, token);
        return token;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};
export const logoutApi = async () => {
    try {
        const response = await axiosClient.get(`/api/v1/auth/logout`);
        localStorage.setItem(ACCESS_TOKEN, '');
        return response.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
};
