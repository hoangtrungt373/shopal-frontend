import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {CustomerMembership} from "../model/enterprise/CustomerMembership";
import {Enterprise} from "../model/Enterprise";

export const getCustomerMembershipForCurrentEnterprise = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<CustomerMembership[]>(`/customer/current-enterprise/customer-membership/get-all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getAllEnterprise = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<Enterprise[]>(`/enterprise/all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getCurrentEnterpriseInfo = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<Enterprise>(`/enterprise/current-enterprise/info`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
