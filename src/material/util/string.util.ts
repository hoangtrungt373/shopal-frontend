export const isNotBlank = (str: string) => {
    return str != null && str != "" && str != undefined;
}

export const isBlank = (str: string) => {
    return str == null || str == "" || str == undefined;
}