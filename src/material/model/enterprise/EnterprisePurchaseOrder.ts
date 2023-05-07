import {AbstractModel} from "../AbstractModel";
import {CustomerPurchaseProduct} from "../customer/CustomerPurchaseProduct";
import {Customer} from "../Customer";

export interface EnterprisePurchaseOrder extends AbstractModel {
    customerFullName: string;
    customerContactEmail: string;
    customer: Customer;
    orderTotalPointExchange: number;
    orderDate: string;
    deliveryStatus: string;
    deliveryStatusDescription: string;
    orderStatus: string;
    orderStatusDescription: string;
    deliveryDate: string;
    orderTotalItems: number;
    orderTotalCash: number;
    purchaseProducts: CustomerPurchaseProduct[];
}