import {OrderStatus} from "../enums/OrderStatus";

export interface EnterprisePurchaseOrderSearchCriteriaRequest {
    startDate: string,
    endDate: string,
    orderStatus: OrderStatus
}