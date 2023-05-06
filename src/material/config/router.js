export const AssetPath = {
    errorPageImg: "",
    cartEmptyImg: process.env.PUBLIC_URL + "/img/web/cart_empty.png",
    webLogoUrl: process.env.PUBLIC_URL + "/logo.png",
    productImgUrl: process.env.PUBLIC_URL + "/img/product/",
    enterpriseLogoUrl: process.env.PUBLIC_URL + "/img/enterprise/"
}

export const CustomerRouter = {
    homePage: "/",
    errorPage: "/error",
    loginPage: "/login",
    registerPage: "/register",
    productCollectionPage: "/search",
    productDetailPage: "/products",
    cartPage: "/cart",
    checkoutPage: "/checkout",
    checkoutSuccess: "/checkout/ok",
    dashBoardPage: "/account",
    membershipPage: "/account/membership",
    purchasedOrderHistory: "/account/order",
    purchaseOrderHistoryDetail: "/account/order"
}

export const EnterpriseRouter = {
    loginPage: "/enterprise/login",
    dashboardPage: "/enterprise/dashboard",
    customerManagementPage: "/enterprise/dashboard/customers",
    purchaseOrderManagement: "/enterprise/dashboard/orders",
    productCollectionPage: "/enterprise/dashboard/products",
    cooperationContractManagement: "/enterprise/dashboard/contract",
    accounting: "/enterprise/dashboard/accounting",
}

export const AdminRouter = {
    loginPage: "/admin/login",
    dashboardPage: "/admin/dashboard",
    productCollectionPage: "/admin/dashboard/products",
    newProductPage: "/admin/dashboard/products/new",
}