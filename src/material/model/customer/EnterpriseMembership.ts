import {AbstractModel} from "../AbstractModel";
import {Enterprise} from "../Enterprise";

export interface EnterpriseMembership extends AbstractModel {
    registerEmail: string;
    registerPhoneNumber: string;
    availablePoint: number;
    enterprise: Enterprise;
}