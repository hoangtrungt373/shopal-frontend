import {AbstractModel} from "./AbstractModel";
import {ProductTrendingState} from "./enums/ProductTrendingState";
import {CatalogStatus} from "./enums/CatalogStatus";

export interface Catalog extends AbstractModel {
    catalogName: string,
    parentCatalogId: number,
    parentCatalogName: string,
    logoUrl: string;
    level: number;
    childCatalogs: Catalog[]
    totalProduct: number,
    totalSell: number,
    productTrendingState: ProductTrendingState,
    catalogStatus: CatalogStatus,
    catalogStatusDescription: string
}
