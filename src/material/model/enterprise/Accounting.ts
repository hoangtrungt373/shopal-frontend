import {AbstractModel} from "../AbstractModel";
import {PaymentStatus} from "../enums/PaymentStatus";
import {Enterprise} from "../Enterprise";

export interface Accounting extends AbstractModel {
    startDate: string;
    endDate: string;
    totalIncome: number;
    totalCommission: number;
    paymentDate: string;
    paymentStatus: PaymentStatus,
    paymentStatusDescription: string,
    paymentMethod: string;
    paymentMethodDescription: string;
    commissionRate: number;
    enterprise: Enterprise
}