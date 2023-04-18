import * as React from 'react';
import {CustomerRouter} from "../config/router";
import {BrowserRouter as Router, Route} from "react-router-dom";
import CustomerHomePage from "./customer/home/CustomerHomePage";
import CustomerLogin from "./customer/login/CustomerLogin";

const PageContainer = () => {
    return (
        <Router>
            <Route path={CustomerRouter.homePage} component={CustomerHomePage} exact/>
            <Route path={CustomerRouter.loginPage} component={CustomerLogin} exact/>
        </Router>
    )

}

export default PageContainer;
