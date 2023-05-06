import {AbstractModel} from "./AbstractModel";
import {Gender} from "./enums/Gender";

export interface Customer extends AbstractModel {
    contactEmail: string;
    fullName: string;
    phoneNumber: string;
    gender: Gender;
    genderDescription: string;
    avatarUrl: string;
    address: string;
    birthDate: string;
}