import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {EnterpriseMembership} from "../model/customer/EnterpriseMembership";

export const getEnterpriseMembershipForCurrentCustomer = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<EnterpriseMembership[]>(`/membership/current-customer/enterprise-mambership/get-all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
