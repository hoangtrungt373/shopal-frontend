import {AbstractModel} from "./AbstractModel";
import {CooperationContract} from "./CooperationContract";

export interface Enterprise extends AbstractModel {
    enterpriseName: string;
    logoUrl: string;
    uploadLogoUrl: any,
    phoneNumber: string,
    address: string,
    websiteUrl: string,
    joinDate: string,
    contract: CooperationContract,
    contactEmail: string,
    taxId: string
}
