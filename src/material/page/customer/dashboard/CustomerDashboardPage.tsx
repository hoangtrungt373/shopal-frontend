import * as React from "react";
import {useEffect, useState} from "react";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import {AssetPath, CustomerRouter} from "../../../config/router";
import CustomerAccountInfoPage from "../accountinfo/CustomerAccountInfoPage";
import {Customer} from "../../../model/Customer";
import {getCurrentCustomerInfo} from "../../../service/customer.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {Switch, useHistory, useLocation} from "react-router-dom";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import Box from "@mui/material/Box";
import CustomerMembershipPage from "../membership/CustomerMembershipPage";
import CustomerPurchaseOrderHistoryPage from "../orderhistory/CustomerPurchaseOrderHistoryPage";
import PrivateRoute from "../../common/share/PrivateRoute";
import {isAuthenticated, isAuthenticatedByRole} from "../../../util/auth.util";
import {UserRole} from "../../../model/enums/UserRole";
import {CURRENT_USER_ROLE} from "../../../config/constants";
import PageSpinner from "../../common/share/PageSpinner";
import CustomerUpdatePhoneNumberPage from "../updatephonenumber/CustomerUpdatePhoneNumberPage";
import CustomerUpdateEmailPage from "../updateemail/CustomerUpdateEmailPage";
import {SideBarListItem} from "../../common/share/MainSideBarListItem";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CustomerPurchaseOrderDetailPage from "../orderdetail/CustomerPurchaseOrderDetailPage";

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

const customerListItems: SideBarListItem[] = [
    {
        title: "Account",
        url: CustomerRouter.dashBoardPage,
        icon: <StoreIcon/>,
    },
    {
        title: "Orders",
        url: CustomerRouter.purchasedOrderHistory,
        icon: <ShoppingCartIcon/>,
    },
    {
        title: "Memberships",
        url: CustomerRouter.membershipPage,
        icon: <PeopleIcon/>,
    },
    {
        title: "Notification",
        url: "*",
        icon: <NotificationsNoneIcon/>,
    },
]

const CustomerDashboardSideBar: React.FC<Props> = ({customer}) => {


    const location = useLocation();
    const [currentItem, setCurrentItem] = useState<string>(null);

    useEffect(() => {
        customerListItems.forEach(item => item.active = false);
        let currentPath = location.pathname;
        customerListItems.forEach(item => {
            if (currentPath.startsWith(item.url) && currentPath[item.url.length] != "/") {
                setCurrentItem(item.title);
            }
        })
    }, [location])

    return (
        <Box>
            <Box sx={{display: "flex", alignItems: "center", gap: 2.5, mb: 2}}>
                <Avatar alt="img"
                        src={AssetPath.avatarDefaultImg}
                        sx={{width: 50, height: 50}}/>
                <Box sx={{display: "flex", flexDirection: "column", mt: 0.5}}>
                    <Typography style={{color: "var(--neutralgray-700)"}}>Account of</Typography>
                    <Typography
                        style={{fontSize: "16px"}}>{customer.fullName != null ? customer.fullName : customer.contactEmail}</Typography>
                </Box>
            </Box>
            {
                customerListItems.map((item, index) => {

                    return (
                        <ListItemButton href={item.url}
                                        style={{backgroundColor: item.title == currentItem ? "#EBEBF0" : null}}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title}/>
                        </ListItemButton>
                    )
                })
            }
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
            <Box sx={{display: "flex", gap: 2, justifyContent: "space-between"}}>
                <Box sx={{width: "20%"}}>
                    <CustomerDashboardSideBar customer={currentCustomer}/>
                </Box>
                <Box sx={{width: "80%"}}>
                    <Switch>
                        <PrivateRoute path={CustomerRouter.dashBoardPage} component={CustomerAccountInfoPage}
                                      customer={currentCustomer}
                                      exact/>
                        <PrivateRoute path={CustomerRouter.updatePhoneNumberPage}
                                      component={CustomerUpdatePhoneNumberPage}
                                      customer={currentCustomer}
                                      exact/>
                        <PrivateRoute path={CustomerRouter.updateEmailPage}
                                      component={CustomerUpdateEmailPage}
                                      customer={currentCustomer}
                                      exact/>
                        <PrivateRoute path={CustomerRouter.membershipPage} component={CustomerMembershipPage}
                                      exact/>
                        <PrivateRoute path={CustomerRouter.purchasedOrderHistory}
                                      component={CustomerPurchaseOrderHistoryPage} exact/>
                        <PrivateRoute
                            path={CustomerRouter.purchasedOrderHistory + "/*.:purchaseOrderId"}
                            component={CustomerPurchaseOrderDetailPage}/>
                    </Switch>
                </Box>
            </Box>
        );
    } else {
        return (
            <PageSpinner/>
        );
    }
}

export default CustomerDashboardPage;