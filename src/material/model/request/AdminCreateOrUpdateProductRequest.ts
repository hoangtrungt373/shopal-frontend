import {ProductStatus} from "../enums/ProductStatus";
import {ProductType} from "../enums/ProductType";

export interface AdminCreateOrUpdateProductRequest {
    productId: number,
    productName: string,
    sku?: string,
    quantityInStock: number,
    content?: string,
    inputDate?: string,
    expirationDate: string,
    initialCash: string,
    productType: ProductType,
    catalogId: number,
    catalogName?: string,
    tags?: string[],
    files?: any[],
    productDescriptionUrl?: string,
    productStatus: ProductStatus
}