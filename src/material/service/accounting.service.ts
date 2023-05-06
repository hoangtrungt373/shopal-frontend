import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {EnterpriseAccounting} from "../model/enterprise/EnterpriseAccounting";

export const getAllAccountingForCurrentEnterprise = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<EnterpriseAccounting[]>(`/accounting/current-enterprise/accounting/get-all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const createNewUrlProcessPaymentAccountingForCurrentEnterprise = async (accountingId: number) => {
    try {
        const result: AxiosResponse = await axiosClient.post<String>(`/accounting/current-enterprise/create-url-process-payment`, accountingId);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
