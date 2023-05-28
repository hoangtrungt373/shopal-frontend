import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {Customer} from "../model/Customer";
import {CustomerSearchCriteriaRequest} from "../model/request/CustomerSearchCriteriaRequest";
import {CustomerAllInfo} from "../model/admin/CustomerAllInfo";
import {CustomerSyncInfoRequest} from "../model/request/CustomerSyncInfoRequest";

export const getCurrentCustomerInfo = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<Customer>(`/customer/current-customer/info`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const handleSendEmailVerifyEmailUpdate = async (newEmail: string) => {
    try {
        const result: AxiosResponse = await axiosClient.post<string>(`/customer/current-customer/verify-new-email`, newEmail);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const updateCurrentCustomerInfo = async (request: Customer) => {
    try {
        const formData = new FormData();
        formData.append('dto', new Blob([JSON.stringify(request)], {type: 'application/json'}));
        formData.append("uploadAvatarUrl", request.uploadAvatarUrl);
        const result: AxiosResponse = await axiosClient.post<string>(`/customer/current-customer/update`, formData);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getCustomerAllInfoByCriteria = async (request: CustomerSearchCriteriaRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<CustomerAllInfo[]>(`/customer/get-all-info`, request);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const syncCustomerPoint = async (requests: CustomerSyncInfoRequest[]) => {
    try {
        const result: AxiosResponse = await axiosClient.post<string>(`/customer/customer-point-sync`, requests);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}