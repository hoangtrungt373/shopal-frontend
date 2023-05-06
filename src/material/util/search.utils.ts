import {DEFAULT_SEARCH_LIMIT, DEFAULT_SEARCH_OFFSET} from "../config/constants";
import {ProductSearchPath} from "../model/request/ProductSearchPath";
import {ProductSearchCriteriaRequest} from "../model/request/ProductSearchCriteriaRequest";

export const createSearchQuery = (model: any) => {
    let searchPath = "";
    for (const [key, value] of Object.entries(model)) {
        // @ts-ignore
        if (value !== null && value !== undefined && value.length !== 0) {
            searchPath = searchPath + "&" + key + "=" + value;
        }
    }
    return "?" + searchPath.slice(1)
}

export const getModelFromSearchParams = (params: URLSearchParams, dto: any) => {
    try {
        // @ts-ignore
        for (let param of params.keys()) {
            if (param !== null && dto.hasOwnProperty(param)) {
                if (Array.isArray(dto[param])) {
                    dto[param] = splitStrAndReturnArr(params.get(param), ',');
                } else {
                    dto[param] = splitStrAndReturnArr(params.get(param), ',')[0];
                }
            }
        }
        return dto;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const splitStrAndReturnArr = (str: string | null, comma: string) => {
    return str !== null ? [...str.split(comma)] : []
}
//
// const updateFiltersFromSearchPathByType = (arr: any[], filters: AbstractFilter[], type: string) => {
//     for (let filter of filters) {
//         if (filter.type === type) {
//             for (let i of arr) {
//                 // @ts-ignore
//                 filter.valueList.find((y: { value: string; }) => y.value === i).checked = true;
//             }
//             break;
//         }
//     }
//     return filters;
// }
//
// export const updateFiltersFromSearchPath = (filters: AbstractFilter[], searchPath: any) => {
//     const keys = Object.keys(searchPath);
//     for (let k of keys) {
//         // @ts-ignore
//         if (Array.isArray(searchPath[k])) {
//             // @ts-ignore
//             filters = updateFiltersFromSearchPathByType(searchPath[k], filters, k)
//         }
//     }
//     return filters;
// }

export const productSearchPathToProductSearchCriteriaRequest = (productSearchPath: ProductSearchPath) => {
    let productCriterion: ProductSearchCriteriaRequest = {
        // @ts-ignore
        catalogIdList: productSearchPath.catalog != null ? [productSearchPath.catalog] : [],
        // @ts-ignore
        enterpriseIdList: [...productSearchPath.enterprise || []],
        limit: DEFAULT_SEARCH_LIMIT,
        offset: productSearchPath.page == 0 ? DEFAULT_SEARCH_OFFSET : (productSearchPath.page - 1) * DEFAULT_SEARCH_LIMIT,
        keyword: productSearchPath.keyword
    }
    return productCriterion;
}
