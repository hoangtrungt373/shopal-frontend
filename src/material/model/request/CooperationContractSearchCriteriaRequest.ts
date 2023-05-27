import {ContractStatus} from "../enums/ContractStatus";
import {AbstractSearchCriteria} from "./AbstractSearchCriteria";

export interface CooperationContractSearchCriteriaRequest extends AbstractSearchCriteria {
    startDate?: string,
    endDate?: string,
    contractStatus?: ContractStatus,
    enterpriseId?: number
}