import {AbstractModel} from "./AbstractModel";
import {Catalog} from "./Catalog";
import {ProductPoint} from "./ProductPoint";
import {ProductImage} from "./ProductImage";
import {ProductStatus} from "./enums/ProductStatus";


export interface ProductDetail extends AbstractModel {
    productName: string;
    sku?: number;
    quantityInStock: number;
    descriptionContentUrl?: string;
    productStatus: ProductStatus,
    productStatusDescription: string,
    content?: string;
    rating?: number;
    amountSold?: number;
    catalogs: Catalog[];
    inputDate: string;
    expirationDate: string;
    initialCash: number,
    exchangeAblePoints: ProductPoint[];
    imageUrls: ProductImage[];
}

