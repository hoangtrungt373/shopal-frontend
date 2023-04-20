export const AssetPath = {
    errorPageImg: "",
    productImgUrl: process.env.PUBLIC_URL + "/img/product/",
}

export const CustomerRouter = {
    homePage: "/",
    errorPage: "/error",
    loginPage: "/login",
    registerPage: "/register",
    productDetailPage: "/products"
}

export const AdminRouter = {
    dashboardPage: "/admin/dashboard",
    categoryManagementPage: "/admin/dashboard/category",
    productManagementPage: "/admin/dashboard/product",
    paymentManagementPage: "/admin/dashboard/payment",
    productDetailPage: "/admin/dashboard/product/view",
    newProductPage: "/admin/dashboard/product/new"
}
