import {AbstractModel} from "../AbstractModel";
import {Enterprise} from "../Enterprise";
import {CustomerPurchaseProduct} from "./CustomerPurchaseProduct";

export interface CustomerPurchaseOrder extends AbstractModel {
    enterprise: Enterprise;
    orderTotalPointExchange: number;
    orderDate: string;
    deliveryStatus: string;
    deliveryStatusDescription: string;
    orderStatus: string;
    orderStatusDescription: string;
    deliveryDate: string;
    purchaseProducts: CustomerPurchaseProduct[];
}