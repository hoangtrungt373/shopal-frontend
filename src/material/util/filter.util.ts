import {CatalogStatus} from "../model/enums/CatalogStatus";
import {AbstractFilter} from "../model/AbstractFilter";
import {ProductType} from "../model/enums/ProductType";

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