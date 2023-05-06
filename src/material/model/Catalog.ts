import {AbstractModel} from "./AbstractModel";
import {ProductType} from "./enums/ProductType";

export interface Catalog extends AbstractModel {
    productType: ProductType;
    productTypeDescription: string;
    logoUrl: string;
    level: number;
    childCatalogs: Catalog[]
}
