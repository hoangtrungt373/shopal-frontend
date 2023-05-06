import {Enterprise} from "./Enterprise";
import {ProductCart} from "./ProductCart";

export interface ProductCartGroupByEnterprise {
    enterprise: Enterprise,
    productCarts: ProductCart[],
    orderTotal: number,
    amountTotal: number
}