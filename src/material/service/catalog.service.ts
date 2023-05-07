import {AxiosResponse} from "axios";
import axiosClient from "../config/axiosClient";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import {Catalog} from "../model/Catalog";

export const getAllMainCatalog = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<Catalog[]>(`/catalog/main/all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getAllChildCatalog = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<Catalog[]>(`/catalog/child/all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getAllMainCatalogWithDetail = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<Catalog[]>(`/catalog/main/detail/all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}

export const getAllChildCatalogWithDetail = async () => {
    try {
        const result: AxiosResponse = await axiosClient.get<Catalog[]>(`/catalog/child/detail/all`);
        return result.data;
    } catch (err: ExceptionResponse | any) {
        throw new Object(err.response.data);
    }
}
