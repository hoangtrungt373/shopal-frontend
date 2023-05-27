import {AbstractAnn} from "./AbstractAnn";
import {ContractStatus} from "../enums/ContractStatus";
import {ContractChangeRequestStatus} from "../enums/ContractChangeRequestStatus";

export interface CreateOrUpdateContractRequestAnn extends AbstractAnn {
    cooperationContractId: number,
    startDate: string,
    endDate: string,
    updateEndDate: string,
    commissionRate: number,
    updateCommissionRate: number,
    cashPerPoint: number,
    updateCashPerPoint: number,
    contractStatus: ContractStatus;
    updateContractStatus: ContractStatus;
    contractStatusDescription: string;
    updateContractStatusDescription: string;
    isEdit: boolean;
    contractChangeRequestStatus: ContractChangeRequestStatus
    cancelReason: string;
}