import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import axiosClient from "../config/axiosClient";
import {AxiosResponse} from "axios";
import {Cart} from "../model/Cart";
import {UpdateProductCartRequest} from "../model/request/UpdateProductCartRequest";
import {ACCESS_TOKEN} from "../config/constants";

export const getCurrentCustomerCart = async () => {
    try {
        console.log(localStorage.getItem(ACCESS_TOKEN))
        const result: AxiosResponse = await axiosClient.get<Cart>(`/cart/current-customer/get`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const updateProductCartsForCurrentCustomer = async (updateProductCartRequests: UpdateProductCartRequest[]) => {
    try {
        const result: AxiosResponse = await axiosClient.post<Cart>(`/cart/current-customer/update`, updateProductCartRequests);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
