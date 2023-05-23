import {AdminRouter, CustomerRouter, EnterpriseRouter} from "../config/router";

export const createSeoLink = (str: string) => {
    return str.replaceAll(" ", '-').replaceAll("/", "-");
}

export const formatVndMoney = (price: number) => {
    price = price !== null ? price : 0;
    return price.toLocaleString('vi-VI', {style: 'currency', currency: 'VND'});
}

export const isCurrentScreenIsLoginOrRegisterPage = (currentScreen: string) => {
    let loginRegisterPages: string[] = [EnterpriseRouter.loginPage, EnterpriseRouter.registerPage, AdminRouter.loginPage, CustomerRouter.registerPage, CustomerRouter.loginPage];
    console.log(currentScreen, loginRegisterPages)
    for (let page of loginRegisterPages) {
        if (currentScreen.includes(page)) {
            return true;
        }
    }
    return false;
}

export const formatRating = (rating: number) => {
    if (rating.toString().length == 1) {
        return rating.toString() + ".0";
    }
}

export const formatDateTime = (datetime: string) => {
    let date = datetime.slice(0, 10);
    let hour = new Date(datetime).getHours();
    let minute = new Date(datetime).getMinutes();

    return date + " " + hour + ":" + minute
}

export const removeExtensionEmail = (email: string) => {
    return email.slice(0, email.lastIndexOf("@"));
}