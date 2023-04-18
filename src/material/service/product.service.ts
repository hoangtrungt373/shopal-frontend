import {ProductDetail} from "../model/ProductDetail";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import axiosClient from "../config/axiosClient";
import {AxiosResponse} from "axios";


export const getProductDetailApi = async (id: number) => {
    try {
        const result: AxiosResponse = await axiosClient.get<ProductDetail>(`/product/get-detail/${id}`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data)
    }
}
