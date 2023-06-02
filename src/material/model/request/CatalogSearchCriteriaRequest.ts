export interface CatalogSearchCriteriaRequest {
    productKeyword: string,
    enterpriseIda: number[],
    parentCatalogId: number,
    childCatalogId: number
}