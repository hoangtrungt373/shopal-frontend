import {AbstractModel} from "./AbstractModel";
import {EnterpriseCooperationContract} from "./enterprise/EnterpriseCooperationContract";

export interface Enterprise extends AbstractModel {
    enterpriseName: string;
    logoUrl: string;
    contract: EnterpriseCooperationContract
}
