import * as React from 'react';
import {CustomerRouter} from "../config/router";
import {BrowserRouter as Router, Route} from "react-router-dom";
import CustomerLogin from "./customer/login/CustomerLogin";
import CustomerProductDetail from "./customer/productdetail/CustomerProductDetail";
import CustomerHomePage from "./customer/home/CustomerHomePage";

const PageContainer = () => {
    return (
        <Router>
            <Route path={CustomerRouter.loginPage} component={CustomerLogin} exact/>
            <Route path={CustomerRouter.homePage} component={CustomerHomePage} exact/>
            <Route path={CustomerRouter.productDetailPage + "/*.:productId"} component={CustomerProductDetail} exact/>
        </Router>
    )

}

export default PageContainer;
