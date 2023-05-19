import {AbstractModel} from "./AbstractModel";
import {Product} from "./Product";

export interface PurchaseOrderDetail extends AbstractModel {
    product: Product,
    pointExchange: number,
    amount: number,
    totalPointExchange: number,
    initialCash: number,
    totalCash: number,
    isReview: boolean
}