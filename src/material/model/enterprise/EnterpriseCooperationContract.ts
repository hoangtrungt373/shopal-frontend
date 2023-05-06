import {ContractStatus} from "../enums/ContractStatus";

export interface EnterpriseCooperationContract {
    startDate: string;
    endDate: string;
    commissionRate: number;
    cashPerPoint: number;
    updateDescription: string;
    contractStatus: ContractStatus;
    contractStatusDescription: string;
}