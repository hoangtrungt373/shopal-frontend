import {ProductDetail} from "../model/ProductDetail";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import axiosClient from "../config/axiosClient";
import {AxiosResponse} from "axios";
import {ProductSearchCriteriaRequest} from "../model/request/ProductSearchCriteriaRequest";
import {Product} from "../model/Product";


export const getProductDetail = async (productId: number) => {
    try {
        const result: AxiosResponse = await axiosClient.get<ProductDetail>(`/product/get-detail/${productId}`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getProductByCriteria = async (criteria: ProductSearchCriteriaRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<Product[]>(`/product/get-by-criteria`, criteria);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const handleRequestSellingProductForCurrentEnterprise = async (productId: number) => {
    try {
        const result: AxiosResponse = await axiosClient.get<String>(`/product/current-enterprise/request-selling/${productId}`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const handleRequestCancellingProductForCurrentEnterprise = async (productId: number) => {
    try {
        const result: AxiosResponse = await axiosClient.get<String>(`/product/current-enterprise/request-cancelling/${productId}`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
