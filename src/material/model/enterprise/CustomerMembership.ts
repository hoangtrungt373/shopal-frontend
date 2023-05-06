import {Gender} from "../enums/Gender";
import {AbstractModel} from "../AbstractModel";

export interface CustomerMembership extends AbstractModel {
    customerId: number;
    registerEmail: string;
    fullName: string;
    registerPhoneNumber: string;
    gender: Gender
    genderDescription: string;
    birthDate: string;
    avatarUrl: string;
    address: string;
    availablePoint: number;
}