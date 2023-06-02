import {CatalogStatus} from "../model/enums/CatalogStatus";
import {AbstractFilter} from "../model/AbstractFilter";
import {ProductType} from "../model/enums/ProductType";
import {ContractStatus} from "../model/enums/ContractStatus";
import {PaymentStatus} from "../model/enums/PaymentStatus";

export const productStatusOptions: AbstractFilter[] = [
    {
        label: "Active",
        value: CatalogStatus.ACTIVE
    },

    {
        label: "Inactive",
        value: CatalogStatus.INACTIVE
    }
];

export const productTypeOptions: AbstractFilter[] = [
    {
        label: "Normal",
        value: ProductType.NORMAL
    },
    {
        label: "Voucher",
        value: ProductType.VOUCHER
    },
    {
        label: "Bill",
        value: ProductType.BILL
    }
];

export const contractStatusOptions: AbstractFilter[] = [
    {
        label: "All",
        value: ContractStatus.ALL
    },
    {
        label: "Pending",
        value: ContractStatus.PENDING
    },
    {
        label: "Active",
        value: ContractStatus.ACTIVE
    },
    {
        label: "InActive",
        value: ContractStatus.INACTIVE
    }
];

export const paymentStatusOptions: AbstractFilter[] = [
    {
        label: "ALL",
        value: PaymentStatus.ALL
    },
    {
        label: "UnPaid",
        value: PaymentStatus.UNPAID
    },
    {
        label: "Paid",
        value: PaymentStatus.PAID
    }
];