import {OrderStatus} from "../enums/OrderStatus";
import {AbstractSearchCriteria} from "./AbstractSearchCriteria";

export interface PurchaseOrderSearchCriteriaRequest extends AbstractSearchCriteria {
    keyword?: string,
    purchaseOrderId?: number,
    orderDateFrom?: string,
    orderDateTo?: string,
    productSku?: string,
    customerId?: number,
    customerContactEmail?: string,
    customerPhoneNumber?: string,
    enterpriseIds?: number[],
    orderStatus?: OrderStatus
}