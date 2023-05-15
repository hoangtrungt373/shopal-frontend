import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {CreateNewPurchaseOrderRequest} from "../model/request/CreateNewPurchaseOrderRequest";
import {CustomerPurchaseOrder} from "../model/customer/CustomerPurchaseOrder";
import {OrderStatus} from "../model/enums/OrderStatus";
import {EnterprisePurchaseOrder} from "../model/enterprise/EnterprisePurchaseOrder";
import {
    EnterprisePurchaseOrderSearchCriteriaRequest
} from "../model/request/EnterprisePurchaseOrderSearchCriteriaRequest";
import {EnterpriseUpdateOrderStatusRequest} from "../model/request/EnterpriseUpdateOrderStatusRequest";
import {CustomerPurchaseOrderCancelRequest} from "../model/customer/CustomerPurchaseOrderCancelRequest";

export const createNewPurchaseOrderForCurrentCustomer = async (createNewPurchaseOrderRequests: CreateNewPurchaseOrderRequest[]) => {
    try {
        const result: AxiosResponse = await axiosClient.post<string>(`/order/current-customer/create`, createNewPurchaseOrderRequests);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getAllPurchaseOrderForCurrentCustomer = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<CustomerPurchaseOrder[]>(`/order/current-customer/order-history/get-all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getPurchaseOrderForCurrentEnterpriseByCriteria = async (criteria: EnterprisePurchaseOrderSearchCriteriaRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<EnterprisePurchaseOrder[]>(`/order/current-enterprise/customer-order/get-by-criteria`, criteria);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getPurchaseOrderDetailForCurrentEnterprise = async (purchaseOrderId: number) => {
    try {
        const result: AxiosResponse = await axiosClient.get<EnterprisePurchaseOrder>(`/order/current-enterprise/customer-order/get-detail/${purchaseOrderId}`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}


export const updatePurchaseOrderStatusForCurrentEnterprise = async (request: EnterpriseUpdateOrderStatusRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<string>(`/order/current-enterprise/customer-order/update-order-status`, request);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const cancelOrderForCurrentCustomer = async (request: CustomerPurchaseOrderCancelRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<string>(`/order/current-customer/cancel-order`, request);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getAllOrderStatus = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<OrderStatus[]>(`/order/order-status/get-all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}