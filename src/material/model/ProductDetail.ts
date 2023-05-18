import {AbstractModel} from "./AbstractModel";
import {Catalog} from "./Catalog";
import {ProductPoint} from "./ProductPoint";
import {ProductImage} from "./ProductImage";
import {ProductStatus} from "./enums/ProductStatus";
import {ProductType} from "./enums/ProductType";
import {ProductReview} from "./ProductReview";


export interface ProductDetail extends AbstractModel {
    productName: string;
    sku?: number;
    quantityInStock: number;
    productDescriptionUrl?: string;
    productStatus: ProductStatus,
    productStatusDescription: string,
    productType: ProductType,
    productTypeDescription: string,
    content?: string;
    rating?: number;
    totalSold?: number;
    totalReview?: number,
    catalogs: Catalog[];
    inputDate: string;
    expirationDate: string;
    initialCash: number,
    exchangeAblePoints: ProductPoint[];
    imageUrls: ProductImage[];
    reviews: ProductReview[]
}

