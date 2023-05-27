import {EnterpriseRegisterRequestStatus} from "../enums/EnterpriseRegisterRequestStatus";
import {AbstractAnn} from "./AbstractAnn";

export interface EnterpriseRegisterRequestAnn extends AbstractAnn {
    fullName: string;
    position: string;
    workEmail: string;
    phoneNumber: string;
    enterpriseAddress: string;
    enterpriseName: string;
    enterpriseWebsite: string;
    registerRequestStatus: EnterpriseRegisterRequestStatus;
    registerRequestStatusDescription: string;
    registerDate: string;
    taxId: string,
    verificationDate: string;
}