import {AbstractSearchCriteria} from "./AbstractSearchCriteria";
import {ProductType} from "../enums/ProductType";
import {ProductStatus} from "../enums/ProductStatus";

export interface ProductSearchCriteriaRequest extends AbstractSearchCriteria {
    productId?: number,
    keyword?: string,
    sku?: string,
    catalogIdList?: number[],
    enterpriseIdList?: number[],
    ratingMin?: number,
    ratingMax?: number,
    initialCashFrom?: number,
    initialCashTo?: number,
    inputDateFrom?: string,
    inputDateTo?: string,
    expirationDateFrom?: string,
    expirationDateTo?: string,
    productType?: ProductType,
    productStatus?: ProductStatus,
    isPolular?: boolean,
    isLastest?: boolean,
    isTopSales?: boolean,
}