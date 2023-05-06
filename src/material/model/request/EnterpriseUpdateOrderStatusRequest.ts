import {OrderStatus} from "../enums/OrderStatus";

export interface EnterpriseUpdateOrderStatusRequest {
    purchaseOrderId: number,
    newOrderStatus: OrderStatus,
    deliveryDate: Date
}