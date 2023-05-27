import {OrderStatus} from "../enums/OrderStatus";

export interface UpdateOrderStatusRequest {
    purchaseOrderId: number,
    newOrderStatus: OrderStatus,
    deliveryDate: Date
}