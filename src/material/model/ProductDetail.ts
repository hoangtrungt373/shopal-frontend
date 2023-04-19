import {AbstractModel} from "./AbstractModel";
import {Catalog} from "./Catalog";


export interface ProductDetail extends AbstractModel {
    productName: string;
    sku?: number;
    // imageUrls: string[];
    quantityInStock: number;
    descriptionContentUrl?: string;
    active: boolean;
    content?: string;
    catalogs: Catalog[]
}

