import {Gender} from "../enums/Gender";

export interface CustomerSearchCriteriaRequest {
    customerId?: number,
    joinDateFrom?: string,
    joinDateTo?: string,
    customerName?: string,
    customerEmail?: string,
    customerPhoneNumber?: string,
    gender?: Gender,
    associateEnterpriseIds?: number[]
    address?: string
}