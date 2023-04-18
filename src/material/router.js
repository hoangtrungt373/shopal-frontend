export const AssetPath = {
    logoPath: process.env.PUBLIC_URL + "/logo.png",
    websiteImgPath: process.env.PUBLIC_URL + "/assets/image/website/",
    cartEmptyImgPath: process.env.PUBLIC_URL + "/assets/image/website/cart-empty.png",
    noProductFoundImgPath: process.env.PUBLIC_URL + "/assets/image/website/no-product-found.png",
    paymentSuccessImgPath: process.env.PUBLIC_URL + "/assets/image/website/payment-success.png",
    noPaymentImgPath: process.env.PUBLIC_URL + "/assets/image/website/no-payment.png",
    pageNotFoundImgPath: process.env.PUBLIC_URL + "/assets/image/website/page-not-found.png",
    productImagePath: process.env.PUBLIC_URL + "/assets/image/product/",
    brandImagePath: process.env.PUBLIC_URL + "/assets/image/brand/",
    productContentPath: process.env.PUBLIC_URL + "/assets/html/product/"
}

export const CustomerRouter = {
    homePage: "/",
    errorPage: "/error",
    loginPage: "/login",
    registerPage: "/register"
}

export const AdminRouter = {
    dashboardPage: "/admin/dashboard",
    categoryManagementPage: "/admin/dashboard/category",
    productManagementPage: "/admin/dashboard/product",
    paymentManagementPage: "/admin/dashboard/payment",
    productDetailPage: "/admin/dashboard/product/view",
    newProductPage: "/admin/dashboard/product/new"
}
