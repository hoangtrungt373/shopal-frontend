import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {Customer} from "../model/Customer";

export const getCurrentCustomerInfo = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<Customer>(`/customer/current-customer/info`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
