import {CatalogStatus} from "../enums/CatalogStatus";

export interface AdminCreateOrUpdateCatalogRequest {
    catalogId: number;
    catalogName: string;
    catalogStatus: CatalogStatus;
    logoUrl: string;
    parentCatalogId: number;
    parentCatalogName?: string,
    level: number;
    childCatalogs: string[];
}