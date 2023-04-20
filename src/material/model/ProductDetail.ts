import {AbstractModel} from "./AbstractModel";
import {Catalog} from "./Catalog";
import {ProductPoint} from "./ProductPoint";
import {ProductImage} from "./ProductImage";


export interface ProductDetail extends AbstractModel {
    productName: string;
    sku?: number;
    quantityInStock: number;
    descriptionContentUrl?: string;
    active: boolean;
    content?: string;
    catalogs: Catalog[];
    exchangeAblePoints: ProductPoint[];
    imageUrls: ProductImage[];
}

