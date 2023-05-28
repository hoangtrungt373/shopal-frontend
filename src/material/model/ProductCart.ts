import {ProductPoint} from "./ProductPoint";
import {AbstractModel} from "./AbstractModel";
import {ProductStatus} from "./enums/ProductStatus";

export interface ProductCart extends AbstractModel {
    productName: string;
    productId: number;
    productStatus: ProductStatus,
    productStatusDescription: string
    quantityInStock: number;
    active: boolean;
    mainImgUrl: string;
    amountSelected: number;
    pointSelected: ProductPoint;
    exchangeAblePoints: ProductPoint[];
    checked: boolean;
}
