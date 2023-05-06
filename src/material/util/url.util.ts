export const createSeoLink = (str: string) => {
    return str.replaceAll(" ", '-').replaceAll("/", "-");
}

export const formatVndMoney = (price: number) => {
    price = price !== null ? price : 0;
    return price.toLocaleString('vi-VI', {style: 'currency', currency: 'VND'});
}