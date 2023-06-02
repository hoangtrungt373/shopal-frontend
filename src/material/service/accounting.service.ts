import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {Accounting} from "../model/enterprise/Accounting";
import {AccountingSearchCriteriaRequest} from "../model/request/AccountingSearchCriteriaRequest";

export const getAccountingByCriteria = async (criteria: AccountingSearchCriteriaRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<Accounting[]>(`/accounting/get-by-criteria`, criteria);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const calculateAccounting = async (criteria: AccountingSearchCriteriaRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<string>(`/accounting/calculate-accounting`, criteria);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const createNewUrlProcessPaymentAccountingForCurrentEnterprise = async (accounting: Accounting) => {
    try {
        const result: AxiosResponse = await axiosClient.post<String>(`/accounting/get-payment-url`, accounting);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
