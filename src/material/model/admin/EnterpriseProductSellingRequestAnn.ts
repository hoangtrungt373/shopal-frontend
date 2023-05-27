import {EnterpriseProductSellingRequestStatus} from "../enums/EnterpriseProductSellingRequestStatus";
import {AbstractAnn} from "./AbstractAnn";

export interface EnterpriseProductSellingRequestAnn extends AbstractAnn {
    cashPerPoint: number
    enterpriseProductSellingRequestStatus: EnterpriseProductSellingRequestStatus,
    enterpriseProductSellingRequestStatusDescription: string
}