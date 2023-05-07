export const AssetPath = {
    errorPageImg: "",
    cartEmptyImg: process.env.PUBLIC_URL + "/img/web/cart_empty.png",
    webLogoUrl: process.env.PUBLIC_URL + "/logo.png",
    productImgUrl: process.env.PUBLIC_URL + "/img/product/",
    productContentUrl: process.env.PUBLIC_URL + "/content/product",
    catalogLogoUrl: process.env.PUBLIC_URL + "/img/catalog/",
    enterpriseLogoUrl: process.env.PUBLIC_URL + "/img/enterprise/",
    uploadReviewUrl: process.env.PUBLIC_URL + "/img/web/upload-preview.png",
    uploadThumbReviewUrl: process.env.PUBLIC_URL + "/img/web/upload-thumb-preview.png"
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
    catalogManagementPage: "/admin/dashboard/catalogs",
    childCatalogManagementPage: "/admin/dashboard/sub-catalogs",
    productCollectionPage: "/admin/dashboard/products",
    purchaseOrderManagement: "/admin/dashboard/orders",
    newProductPage: "/admin/dashboard/products/new",
}