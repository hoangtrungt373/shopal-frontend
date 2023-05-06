import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {Catalog} from "../model/Catalog";

export const getAllCatalog = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<Catalog[]>(`/catalog/all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
