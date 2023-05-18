import {ProductDetail} from "../model/ProductDetail";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import axiosClient from "../config/axiosClient";
import {AxiosResponse} from "axios";
import {ProductSearchCriteriaRequest} from "../model/request/ProductSearchCriteriaRequest";
import {Product} from "../model/Product";
import {AdminCreateOrUpdateProductRequest} from "../model/request/AdminCreateOrUpdateProductRequest";
import {AssetPath} from "../config/router";
import {CustomerProductReviewRequest} from "../model/customer/CustomerProductReviewRequest";
import {CreateOrUpdateProductResponse} from "../model/admin/CreateOrUpdateProductResponse";


export const getProductDetail = async (productId: number) => {
    try {
        const result: AxiosResponse = await axiosClient.get<ProductDetail>(`/product/customer/get-detail/${productId}`);
        const product = result.data;
        await fetch(`${AssetPath.productContentUrl}${product.productDescriptionUrl}`)
            .then((r) => r.text())
            .then(text => {
                product.content = text
            })
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

export const countProductByCriteria = async (criteria: ProductSearchCriteriaRequest) => {
    try {
        const result: AxiosResponse = await axiosClient.post<number>(`/product/count-by-criteria`, criteria);
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

export const createOrUpdateProduct = async (request: AdminCreateOrUpdateProductRequest) => {
    try {
        const formData = new FormData();
        formData.append('dto', new Blob([JSON.stringify(request)], {type: 'application/json'}));
        request.files.forEach((file, index) => {
            formData.append("images", file);
        })
        const result: AxiosResponse = await axiosClient.post<CreateOrUpdateProductResponse>(`/product/current-admin/create-or-update-product`, formData);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const addProductReviewByCurrentCustomer = async (request: CustomerProductReviewRequest) => {
    try {
        const formData = new FormData();
        formData.append('dto', new Blob([JSON.stringify(request)], {type: 'application/json'}));
        request.imgUrls.forEach((file, index) => {
            formData.append("images", file);
        })
        const result: AxiosResponse = await axiosClient.post<string>(`/product/current-customer/add-product-review`, formData);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
