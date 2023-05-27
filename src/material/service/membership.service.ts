import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {EnterpriseMembership} from "../model/customer/EnterpriseMembership";
import {CustomerNewMembershipRequest} from "../model/customer/CustomerNewMembershipRequest";
import {CustomerRegister} from "../model/enterprise/CustomerRegister";

export const getEnterpriseMembershipForCurrentCustomer = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<EnterpriseMembership[]>(`/membership/current-customer/enterprise-membership/get-all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const handleRequestNewMembershipForCurrentCustomer = async (request: CustomerNewMembershipRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<String[]>(`/membership/current-customer/enterprise-membership/request-new`, request);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const importRegisterCustomers = async (request: CustomerRegister[]) => {
    try {
        const result: AxiosResponse = await axiosClient.post<String>(`/membership/import-register-customers`, request);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
