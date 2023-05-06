import {ContractStatus} from "../enums/ContractStatus";

export interface EnterpriseCooperationContractSearchCriteriaRequest {
    startDate: string,
    endDate: string,
    contractStatus: ContractStatus
}