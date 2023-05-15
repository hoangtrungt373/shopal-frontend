import {AbstractModel} from "./AbstractModel";
import {Gender} from "./enums/Gender";

export interface Customer extends AbstractModel {
    loginEmail?: string,
    contactEmail?: string;
    fullName?: string;
    nickName?: string,
    phoneNumber?: string;
    gender?: Gender;
    genderDescription?: string;
    avatarUrl?: string;
    uploadAvatarUrl?: any,
    address?: string;
    birthDate?: string;
}