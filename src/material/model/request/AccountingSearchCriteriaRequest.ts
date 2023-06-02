import {PaymentStatus} from "../enums/PaymentStatus";
import {AbstractSearchCriteria} from "./AbstractSearchCriteria";

export interface AccountingSearchCriteriaRequest extends AbstractSearchCriteria {
    enterpriseId?: number,
    startDate?: string,
    endDate?: string,
    paymentStatus?: PaymentStatus
}