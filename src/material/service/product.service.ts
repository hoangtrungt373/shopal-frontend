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
        const result: AxiosResponse = await axiosClient.get<ProductDetail>(`/product/get-detail/${productId}`);
        const product = result.data;

        await fetch(`${AssetPath.productContentUrl}${product.productDescriptionUrl}`)
            .then((res) => res.text())
            .then((text) => {
                product.content = text;
                product.files = [];
            });

        await fetchAllImg(product.imageUrls.map(x => x.imageUrl))
            .then((files: File[]) => {
                product.files = [...files];
            });

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
        request.uploadImgUrls.forEach((file, index) => {
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


export const fetchAllImg = async (fileNames: string[]) => {
    let list = [];
    let metadata = {
        type: 'image/webp'
    };

    let files: File[] = [];
    fileNames.forEach(function (fileName, i) {
        list.push(
            fetch(`${AssetPath.productImgUrl}${fileName}`)
                .then(res => res.blob())
                .then((data: any) => {
                    files.push(new File([data], fileName, metadata));
                }));
    });

    return Promise
        .all(list)
        .then(function () {
            return files;
        });
}