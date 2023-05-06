import {AbstractSearchCriteria} from "./AbstractSearchCriteria";

export interface ProductSearchCriteriaRequest extends AbstractSearchCriteria {
    keyword?: string;
    catalogIdList?: number[];
    enterpriseIdList?: number[];
    ratingMin?: number;
    ratingMax?: number;
    isPolular?: boolean;
    isLastest?: boolean;
    isTopSales?: boolean;
}