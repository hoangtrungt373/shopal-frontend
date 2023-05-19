import {Enterprise} from "./Enterprise";
import {Customer} from "./Customer";
import {PurchaseOrderDetail} from "./PurchaseOrderDetail";
import {AbstractModel} from "./AbstractModel";

export interface PurchaseOrder extends AbstractModel {
    enterprise: Enterprise,
    customer: Customer,
    orderTotalPointExchange: number,
    orderDate: string,
    deliveryStatus: string,
    deliveryStatusDescription: string,
    orderStatus: string,
    orderStatusDescription: string,
    deliveryDate: string,
    orderTotalCash: number
    purchaseProducts: PurchaseOrderDetail[];
}