import {AbstractModel} from "./AbstractModel";


export interface ProductDetail extends AbstractModel {
    productName: string;
    price: number;
    sku?: number;
    productImages: string[];
    quantityInStock: number;
    descriptionContentUrl?: string;
    content?: string;
    active: boolean;
}

