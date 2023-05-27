import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {CooperationContract} from "../model/CooperationContract";
import {CooperationContractSearchCriteriaRequest} from "../model/request/CooperationContractSearchCriteriaRequest";
import {CreateOrUpdateContractRequestAnn} from "../model/admin/CreateOrUpdateContractRequestAnn";


export const getCooperationContractByCriteria = async (criteria: CooperationContractSearchCriteriaRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<CooperationContract[]>(`/contract/get-by-criteria`, criteria);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const handleReceiveCreateOrUpdateContract = async (request: CooperationContract) => {
    try {
        const result: AxiosResponse = await axiosClient.post<string>(`/contract/receive-create-or-update-contract-request`, request);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getAllCreateOrUpdateContractAnn = async () => {
    try {
        const result: AxiosResponse = await axiosClient.post<CreateOrUpdateContractRequestAnn[]>(`/contract/create-or-update-contract-request/get-by-criteria`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const handleAcceptCreateOrUpdateContractRequest = async (request: CreateOrUpdateContractRequestAnn) => {
    try {
        const result: AxiosResponse = await axiosClient.post<String>(`/contract/create-or-update-contract-request/accept`, request);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}