import {AbstractModel} from "./AbstractModel";
import {ProductPoint} from "./ProductPoint";
import {ProductType} from "./enums/ProductType";
import {ProductStatus} from "./enums/ProductStatus";


export interface Product extends AbstractModel {
    productName: string;
    sku?: number;
    quantityInStock: number;
    descriptionContentUrl?: string;
    rating?: number;
    productStatus: ProductStatus,
    productStatusDescription: string,
    amountSold?: number;
    mainImgUrl: string;
    mainImgText: string;
    inputDate: string,
    expirationDate: string,
    initialCash: number,
    exchangeAblePoints: ProductPoint[];
    productType: ProductType
}

