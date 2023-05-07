import {ProductDetail} from "../model/ProductDetail";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import axiosClient from "../config/axiosClient";
import {AxiosResponse} from "axios";
import {ProductSearchCriteriaRequest} from "../model/request/ProductSearchCriteriaRequest";
import {Product} from "../model/Product";
import {AdminCreateOrUpdateProductRequest} from "../model/request/AdminCreateOrUpdateProductRequest";


export const getProductDetail = async (productId: number) => {
    try {
        const result: AxiosResponse = await axiosClient.get<ProductDetail>(`/product/get-detail/${productId}`);
        const product = result.data;
        // await fetch(`${AssetPath.productContentUrl}${product.descriptionContentUrl}`)
        //     .then((r) => r.text())
        //     .then(text => {
        //         product.content = text
        //     })
        return product;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getProductByCriteria = async (criteria: ProductSearchCriteriaRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<Product[]>(`/product/get-by-criteria`, criteria);
        const product = result.data;
        return product;
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

export const createOrUpdateProduct = async (request: AdminCreateOrUpdateProductRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<String>(`/product/current-admin/create-or-update-product`, request);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
