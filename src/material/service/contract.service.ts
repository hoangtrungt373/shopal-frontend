import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {EnterpriseCooperationContract} from "../model/enterprise/EnterpriseCooperationContract";
import {
    EnterpriseCooperationContractSearchCriteriaRequest
} from "../model/request/EnterpriseCooperationContractSearchCriteriaRequest";


export const getCooperationContractForCurrentEnterpriseByCriteria = async (criteria: EnterpriseCooperationContractSearchCriteriaRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<EnterpriseCooperationContract[]>(`/contract/current-enterprise/get-by-criteria`, criteria);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
