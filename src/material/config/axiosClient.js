import axios from "axios";
import {ACCESS_TOKEN, TOKEN_TYPE} from "./constants";

const axiosClient = axios.create({
    headers: {
        'Content-Type': 'application/json'
    },
});


axiosClient.interceptors.request.use(async (config) => {
    const customHeaders = {};

    const accessToken = TOKEN_TYPE + localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
        customHeaders.Authorization = accessToken;
    }

    return {
        ...config,
        headers: {
            ...customHeaders,
            ...config.headers,
        }
    };
});

export default axiosClient;


