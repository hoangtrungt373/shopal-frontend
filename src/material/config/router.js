export const AssetPath = {
    errorPageImg: "",
    cartEmptyImg: process.env.PUBLIC_URL + "/img/web/cart_empty.png",
    webLogoUrl: process.env.PUBLIC_URL + "/logo.png",
    productUploadPreviewImg: process.env.PUBLIC_URL + "/img/web/upload-preview.png",
    avatarPreviewImg: process.env.PUBLIC_URL + "/img/web/avatar-preview.png",
    avatarDefaultImg: process.env.PUBLIC_URL + "/img/web/avatar-default.png",
    uploadThumbReviewImg: process.env.PUBLIC_URL + "/img/web/upload-thumb-preview.png",
    emptyOrderImg: process.env.PUBLIC_URL + "/img/web/empty-order.png",
    emptyEnterpriseImg: process.env.PUBLIC_URL + "/img/web/empty_enterprise.png",
    noReviewImg: process.env.PUBLIC_URL + "/img/web/no-reviews.png",
    orderSuccessImg: process.env.PUBLIC_URL + "/img/web/order-success.png",

    productImgUrl: process.env.PUBLIC_URL + "/img/product/",
    productContentUrl: process.env.PUBLIC_URL + "/content/product/",
    customerAvatarUrl: process.env.PUBLIC_URL + "/img/customer/",
    catalogLogoUrl: process.env.PUBLIC_URL + "/img/catalog/",
    enterpriseLogoUrl: process.env.PUBLIC_URL + "/img/enterprise/",
    productReviewUrl: process.env.PUBLIC_URL + "/img/review/"
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
    updatePhoneNumberPage: "/account/phone/edit",
    updateEmailPage: "/account/email/edit",
    membershipPage: "/account/membership",
    purchasedOrderHistory: "/account/order",
}

export const EnterpriseRouter = {
    registerPage: "/enterprise/register",
    loginPage: "/enterprise/login",
    dashboardPage: "/enterprise/dashboard",
    customerMembershipManagementPage: "/enterprise/dashboard/customers/memberships",
    purchaseOrderManagement: "/enterprise/dashboard/orders",
    productCollectionPage: "/enterprise/dashboard/products",
    cooperationContractManagement: "/enterprise/dashboard/contract",
    accounting: "/enterprise/dashboard/accounting",
}

export const AdminRouter = {
    loginPage: "/admin/login",
    dashboardPage: "/admin/dashboard",
    customerManagementPage: "/admin/dashboard/customers",
    enterpriseCooperationRequestManagement: "/admin/dashboard/enterprises/request",
    enterpriseManagement: "/admin/dashboard/enterprises",
    catalogManagementPage: "/admin/dashboard/catalogs",
    childCatalogManagementPage: "/admin/dashboard/sub-catalogs",
    productCollectionPage: "/admin/dashboard/products",
    purchaseOrderManagement: "/admin/dashboard/orders",
    newProductPage: "/admin/dashboard/products/new",
}