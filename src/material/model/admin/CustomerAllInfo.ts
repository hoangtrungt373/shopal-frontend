import {AbstractModel} from "../AbstractModel";
import {Gender} from "../enums/Gender";
import {MembershipPoint} from "./MembershipPoint";

export interface CustomerAllInfo extends AbstractModel {
    contactEmail: string,
    fullName: string,
    nickName: string
    phoneNumber: string,
    gender: Gender,
    genderDescription: string,
    birthDate: string,
    avatarUrl: string,
    address: string,
    joinDate: string,
    totalBuy: number,
    membershipPoints: MembershipPoint[]
}
