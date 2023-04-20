import * as React from 'react';
import {CustomerRouter} from "../config/router";
import {BrowserRouter as Router, Route} from "react-router-dom";
import CustomerLoginPage from "./customer/login/CustomerLoginPage";
import CustomerProductDetailPage from "./customer/productdetail/CustomerProductDetailPage";
import CustomerHomePage from "./customer/home/CustomerHomePage";
import CustomerRegisterPage from "./customer/resiter/CustomerRegisterPage";

const PageContainer = () => {
    return (
        <Router>
            <Route path={CustomerRouter.loginPage} component={CustomerLoginPage} exact/>
            <Route path={CustomerRouter.registerPage} component={CustomerRegisterPage} exact/>
            <Route path={CustomerRouter.homePage} component={CustomerHomePage} exact/>
            <Route path={CustomerRouter.productDetailPage + "/*.:productId"} component={CustomerProductDetailPage}
                   exact/>
        </Router>
    )

}

export default PageContainer;
