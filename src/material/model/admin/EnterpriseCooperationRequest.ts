import {EnterpriseRegisterRequestStatus} from "../enums/EnterpriseRegisterRequestStatus";
import {Enterprise} from "../Enterprise";

export interface EnterpriseCooperationRequest {
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
    verificationDate: string;
    enterprise: Enterprise;
}