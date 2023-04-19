import {ProductDetail} from "../model/ProductDetail";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import axiosClient from "../config/axiosClient";
import {AxiosResponse} from "axios";


export const getProductDetailApi = async (productId: number) => {
    try {
        const result: AxiosResponse = await axiosClient.get<ProductDetail>(`/product/get-detail/${productId}`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
