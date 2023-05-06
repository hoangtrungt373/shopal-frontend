import {AbstractModel} from "../AbstractModel";

export interface CustomerRegister extends AbstractModel {
    stagCustomerId: number;
    registerEmail: string;
    fullName: string;
    registerPhoneNumber: string;
    importDate: string;
    initialPoint: number;
}