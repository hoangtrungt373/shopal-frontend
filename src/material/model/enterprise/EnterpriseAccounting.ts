import {AbstractModel} from "../AbstractModel";
import {PaymentStatus} from "../enums/PaymentStatus";

export interface EnterpriseAccounting extends AbstractModel {
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
}