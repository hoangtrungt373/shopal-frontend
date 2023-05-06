import * as React from "react";
import {useEffect, useState} from "react";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import {CustomerRouter} from "../../../config/router";
import CustomerAccountInfoPage from "../accountinfo/CustomerAccountInfoPage";
import {Customer} from "../../../model/Customer";
import {getCurrentCustomerInfo} from "../../../service/customer.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {Switch, useHistory} from "react-router-dom";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import Box from "@mui/material/Box";
import CustomerMembershipPage from "../membership/CustomerMembershipPage";
import CustomerPurchaseOrderHistoryPage from "../orderhistory/CustomerPurchaseOrderHistoryPage";
import PrivateRoute from "../../common/share/PrivateRoute";
import {isAuthenticated, isAuthenticatedByRole} from "../../../util/auth.util";
import {UserRole} from "../../../model/enums/UserRole";
import {CURRENT_USER_ROLE} from "../../../config/constants";
import PageSpinner from "../../common/share/PageSpinner";

const theme = createTheme({
    typography: {
        body1: {
            fontSize: 14
        },
        button: {
            fontSize: 14
        },
    },
});

interface Props {
    customer: Customer
}

const CustomerDashboardSideBar: React.FC<Props> = (customer) => {

    return (
        <Box>
            <ListItemButton href={CustomerRouter.dashBoardPage}>
                <ListItemIcon>
                    <StoreIcon/>
                </ListItemIcon>
                <ListItemText primary="Account"/>
            </ListItemButton>
            <ListItemButton href={CustomerRouter.purchasedOrderHistory}>
                <ListItemIcon>
                    <ShoppingCartIcon/>
                </ListItemIcon>
                <ListItemText primary="Orders"/>
            </ListItemButton>
            <ListItemButton href={CustomerRouter.membershipPage}>
                <ListItemIcon>
                    <PeopleIcon/>
                </ListItemIcon>
                <ListItemText primary="Memberships"/>
            </ListItemButton>
            <ListItemButton>
                <ListItemIcon>
                    <BarChartIcon/>
                </ListItemIcon>
                <ListItemText primary="Notification"/>
            </ListItemButton>
        </Box>
    )
}

const CustomerDashboardPage: React.FC<Props> = () => {

    const [currentCustomer, setCurrentCustomer] = useState<Customer>();
    const [isShow, setIsShow] = useState<boolean>(false)
    const history = useHistory();

    /*TODO check rerender*/
    useEffect(() => {
        console.log(isAuthenticated())
        console.log(localStorage.getItem(CURRENT_USER_ROLE))
        if (isAuthenticatedByRole(UserRole.CUSTOMER)) {
            getCurrentCustomerInfo()
                .then((resCustomer: Customer) => {
                    setCurrentCustomer(resCustomer);
                    setIsShow(true)
                })
                .catch((err: ExceptionResponse) => {
                    console.log(err);
                })
        } else {
            history.push({
                pathname: CustomerRouter.homePage
            });
        }

    }, [])

    if (isShow) {
        return (
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <CustomerDashboardSideBar customer={currentCustomer}/>
                    </Grid>
                    <Grid item xs={9}>
                        <Switch>
                            <PrivateRoute path={CustomerRouter.dashBoardPage} component={CustomerAccountInfoPage}
                                          exact/>
                            <PrivateRoute path={CustomerRouter.membershipPage} component={CustomerMembershipPage}
                                          exact/>
                            <PrivateRoute path={CustomerRouter.purchasedOrderHistory}
                                          component={CustomerPurchaseOrderHistoryPage} exact/>
                        </Switch>
                    </Grid>
                </Grid>
            </Box>
        );
    } else {
        return (
            <PageSpinner/>
        );
    }
}

export default CustomerDashboardPage;