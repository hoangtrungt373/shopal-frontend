import {ContractStatus} from "./enums/ContractStatus";
import {Enterprise} from "./Enterprise";
import {AbstractModel} from "./AbstractModel";

export interface CooperationContract extends AbstractModel {
    startDate: string,
    endDate: string,
    commissionRate: number,
    cashPerPoint: number,
    contractStatus: ContractStatus,
    contractStatusDescription?: string,
    enterprise: Enterprise,
}