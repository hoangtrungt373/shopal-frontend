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
    paymentTypeImg: process.env.PUBLIC_URL + "/img/web/payment-type.png",

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
    profilePage: "/enterprise/dashboard/profile",
    customerMembershipManagementPage: "/enterprise/dashboard/customers/memberships",
    customerMembershipDetailPage: "/enterprise/dashboard/customers/membership-detail",
    customerRegisterManagementPage: "/enterprise/dashboard/customers/registers",
    purchaseOrderManagement: "/enterprise/dashboard/orders",
    purchaseOrderDetailPage: "/enterprise/dashboard/order-detail",
    productCollectionPage: "/enterprise/dashboard/products",
    productDetailPage: "/enterprise/dashboard/product-detail",
    cooperationContractManagement: "/enterprise/dashboard/contract",
    accounting: "/enterprise/dashboard/accounting",
    notificationPage: "/enterprise/dashboard/notification",
    paymentSuccessPage: "/vnpay-payment",
}

export const AdminRouter = {
    loginPage: "/admin/login",
    dashboardPage: "/admin/dashboard",
    customerManagementPage: "/admin/dashboard/customers",
    enterpriseRegisterRequestManagement: "/admin/dashboard/cooperation-requests",
    enterpriseManagement: "/admin/dashboard/enterprises",
    catalogManagementPage: "/admin/dashboard/catalogs",
    childCatalogManagementPage: "/admin/dashboard/sub-catalogs",
    productCollectionPage: "/admin/dashboard/products",
    productDetailPage: "/admin/dashboard/product-detail",
    purchaseOrderManagementPage: "/admin/dashboard/orders",
    purchaseOrderDetailPage: "/admin/dashboard/order-detail",
    newProductPage: "/admin/dashboard/products/new",
    // try to optimize to products/edit
    editProductPage: "/admin/dashboard/products-edit",
    accountingPage: "/admin/dashboard/accounting",
    cooperationContractRequestManagement: "/admin/dashboard/contract/request",
    cooperationContractManagement: "/admin/dashboard/contracts",
    requestSellingProductManagement: "/admin/dashboard/product-request-selling",
}