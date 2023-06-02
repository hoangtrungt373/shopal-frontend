import {AbstractSearchCriteria} from "./AbstractSearchCriteria";

export interface AccountingCalculateRequest extends AbstractSearchCriteria {
    startDate?: string,
    endDate?: string,
}