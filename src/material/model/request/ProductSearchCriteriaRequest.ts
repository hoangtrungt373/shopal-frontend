import {AbstractSearchCriteria} from "./AbstractSearchCriteria";
import {UserRole} from "../enums/UserRole";

export interface ProductSearchCriteriaRequest extends AbstractSearchCriteria {
    keyword?: string;
    sku?: string,
    catalogIdList?: number[];
    enterpriseIdList?: number[];
    ratingMin?: number;
    ratingMax?: number;
    isPolular?: boolean;
    isLastest?: boolean;
    isTopSales?: boolean;
    userRole?: UserRole;
}