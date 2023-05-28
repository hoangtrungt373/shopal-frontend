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
import {UpdateOrderStatusRequest} from "../model/request/UpdateOrderStatusRequest";
import {PurchaseOrderCancelRequest} from "../model/customer/PurchaseOrderCancelRequest";
import {PurchaseOrder} from "../model/PurchaseOrder";
import {PurchaseOrderSearchCriteriaRequest} from "../model/request/PurchaseOrderSearchCriteriaRequest";

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

export const getPurchaseOrderByCriteria = async (criteria: PurchaseOrderSearchCriteriaRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<PurchaseOrder[]>(`/order/get-by-crireria`, criteria);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const updatePurchaseOrderStatus = async (request: UpdateOrderStatusRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<string>(`/order/update-order-status`, request);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const cancelOrderForCurrentCustomer = async (request: PurchaseOrderCancelRequest) => {
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