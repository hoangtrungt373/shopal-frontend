import {ProductPoint} from "./ProductPoint";
import {AbstractModel} from "./AbstractModel";

export interface ProductCart extends AbstractModel {
    productName: string;
    productId: number;
    quantityInStock: number;
    active: boolean;
    mainImgUrl: string;
    amountSelected: number;
    pointSelected: ProductPoint;
    exchangeAblePoints: ProductPoint[];
    checked: boolean;
}
