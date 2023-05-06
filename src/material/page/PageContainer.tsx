import * as React from 'react';
import {useEffect, useState} from 'react';
import {AdminRouter, CustomerRouter, EnterpriseRouter} from "../config/router";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import CustomerRegisterPage from "./customer/resiter/CustomerRegisterPage";
import CustomerLoginPage from "./customer/login/CustomerLoginPage";
import EnterpriseLoginPage from "./enterprise/login/EnterpriseLoginPage";
import {Customer} from "../model/Customer";
import {Enterprise} from "../model/Enterprise";
import {isAuthenticated} from "../util/auth.util";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {CustomerHomeHeader} from "./common/customer/CustomerHomeHeader";
import Container from "@mui/material/Container";
import PageSpinner from "./common/share/PageSpinner";
import {ACCESS_TOKEN, CURRENT_USER_ROLE} from "../config/constants";
import {UserRole} from "../model/enums/UserRole";
import Box from "@mui/material/Box";
import {getCurrentCustomerInfo} from "../service/customer.service";
import {ExceptionResponse} from "../model/exception/ExceptionResponse";
import CustomerHomeContentPage from "./customer/homecontent/CustomerHomeContentPage";
import CustomerProductDetailPage from "./customer/productdetail/CustomerProductDetailPage";
import CustomerCartPage from "./customer/cart/CustomerCartPage";
import CustomerProductCollectionPage from "./customer/customerproductcollection/CustomerProductCollectionPage";
import CustomerOrderCheckoutPage from "./customer/checkout/CustomerOrderCheckoutPage";
import {CustomerCheckoutSuccessPage} from "./customer/checkoutsuccess/CustomerCheckoutSuccessPage";
import PrivateRoute from "./common/share/PrivateRoute";
import CustomerDashboardPage from "./customer/dashboard/CustomerDashboardPage";
import Grid from "@mui/material/Grid";
import {EnterpriseCustomerManagementPage} from "./enterprise/customermanagement/EnterpriseCustomerManagementPage";
import EnterprisePurchaseOrderManagementPage from "./enterprise/ordermanagement/EnterprisePurchaseOrderManagementPage";
import EnterpriseCooperationContractManagementPage
    from "./enterprise/cooperationcontractmanagement/EnterpriseCooperationContractManagementPage";
import Toolbar from "@mui/material/Toolbar";
import {Copyright} from '@mui/icons-material';
import {EnterpriseMainListItems} from "./common/enterprise/EnterpriseMainListItem";
import EnterpriseAccountingPage from "./enterprise/accounting/EnterpriseAccountingPage";
import EnterpriseAccountingDetailPage from "./enterprise/accountingdetail/EnterpriseAccountingDetailPage";
import EnterprisePurchaseOrderDetailPage from "./enterprise/orderdetail/EnterprisePurchaseOrderDetailPage";
import EnterpriseProductCollectionPage from "./enterprise/product/EnterpriseProductCollectionPage";
import EnterpriseProductDetailPage from "./enterprise/productdetail/EnterpriseProductDetailPage";
import AdminNewProductPage from "./admin/newproduct/AdminNewProductPage";
import EnterpriseAppBar from "./common/enterprise/EnterpriseAppBar";
import EnterpriseDrawer from "./common/enterprise/EnterpriseDrawer";
import {AdminMainListItem} from "./common/admin/AdminMainListItem";
import AdminDashboardPage from './admin/dahboard/AdminDashboardPage';
import AdminLoginPage from './admin/login/AdminLoginPage';
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import {Badge, Divider} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {AppBar} from "./common/share/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";
import {Drawer} from "./common/share/Drawer";

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


const PageContainer = () => {

    const [currentCustomer, setCurrentCustomer] = useState<Customer>();
    const [currentEnterprise, setCurrentEnterprise] = useState<Enterprise>();
    const [isShow, setIsShow] = useState<boolean>(false);

    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        console.log(localStorage.getItem(CURRENT_USER_ROLE));
        console.log(localStorage.getItem(ACCESS_TOKEN))
        if (isAuthenticated()) {
            if (localStorage.getItem(CURRENT_USER_ROLE) == UserRole.CUSTOMER) {
                getCurrentCustomerInfo()
                    .then((resCustomer: Customer) => {
                        setCurrentCustomer(resCustomer);
                    })
                    .catch((err: ExceptionResponse) => {
                        console.log(err);
                    })
                    .finally(() => {
                        setIsShow(true);
                    });
            } else {
                setIsShow(true);
            }
        } else {
            setIsShow(true);
        }
    }, []);

    const EnterprisePageContainer = () => {
        return (
            <Box>
                <Box sx={{display: 'flex'}}>
                    <EnterpriseAppBar open={open} toggleDrawer={toggleDrawer}/>
                    <EnterpriseDrawer open={open} toggleDrawer={toggleDrawer} content={<EnterpriseMainListItems/>}/>
                    <Box
                        component="main"
                        sx={{
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? theme.palette.grey[100]
                                    : theme.palette.grey[900],
                            flexGrow: 1,
                            height: '100vh',
                            overflow: 'auto',
                        }}
                    >
                        <Toolbar/>
                        <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                        <Switch>
                                            <PrivateRoute path={EnterpriseRouter.customerManagementPage}
                                                          component={EnterpriseCustomerManagementPage}/>
                                            <PrivateRoute path={EnterpriseRouter.purchaseOrderManagement}
                                                          component={EnterprisePurchaseOrderManagementPage}
                                                          exact/>
                                            <PrivateRoute path={EnterpriseRouter.productCollectionPage}
                                                          component={EnterpriseProductCollectionPage}
                                                          exact/>
                                            <PrivateRoute
                                                path={EnterpriseRouter.productCollectionPage + "/*.:productId"}
                                                component={EnterpriseProductDetailPage} exact/>
                                            <PrivateRoute
                                                path={EnterpriseRouter.purchaseOrderManagement + "/*.:purchaseOrderId"}
                                                component={EnterprisePurchaseOrderDetailPage}/>
                                            <PrivateRoute
                                                path={EnterpriseRouter.cooperationContractManagement}
                                                component={EnterpriseCooperationContractManagementPage}
                                                exact/>
                                            <PrivateRoute path={EnterpriseRouter.accounting}
                                                          component={EnterpriseAccountingPage} exact/>
                                            <PrivateRoute
                                                path={EnterpriseRouter.accounting + "/*.:accountingId"}
                                                component={EnterpriseAccountingDetailPage}/>
                                        </Switch>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Copyright sx={{pt: 4}}/>
                        </Container>
                    </Box>
                </Box>
            </Box>
        )
    }

    const AdminPageContainer = () => {
        return (
            <Box sx={{display: 'flex'}}>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px'
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && {display: 'none'}),
                            }}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{flexGrow: 1}}
                        >
                            Dashboard
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: 1,
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </Toolbar>
                    <Divider/>
                    <List component="nav">
                        <AdminMainListItem/>
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar/>
                    <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                    <Switch>
                                        <PrivateRoute path={AdminRouter.dashboardPage}
                                                      component={AdminDashboardPage} exact/>
                                        <PrivateRoute path={AdminRouter.newProductPage}
                                                      component={AdminNewProductPage} exact/>
                                    </Switch>
                                </Box>
                            </Grid>
                        </Grid>
                        <Copyright sx={{pt: 4}}/>
                    </Container>
                </Box>
            </Box>
        )
    }

    const CustomerPageContainer = () => {
        return (
            <Box>
                <CustomerHomeHeader currentCustomer={currentCustomer}/>
                <Container maxWidth="lg">
                    <Switch>
                        <Route path={CustomerRouter.homePage} component={CustomerHomeContentPage}
                               exact/>
                        <Route path={CustomerRouter.productCollectionPage}
                               component={CustomerProductCollectionPage}/>
                        <Route path={CustomerRouter.productDetailPage + "/*.:productId"}
                               component={CustomerProductDetailPage}/>
                        <Route path={CustomerRouter.cartPage} component={CustomerCartPage}/>
                        <Route path={CustomerRouter.checkoutPage} component={CustomerOrderCheckoutPage}
                               exact/>
                        <Route path={CustomerRouter.checkoutSuccess}
                               component={CustomerCheckoutSuccessPage}/>
                        <PrivateRoute path={CustomerRouter.dashBoardPage}
                                      component={CustomerDashboardPage}/>
                    </Switch>
                </Container>
            </Box>
        )
    }


    if (isShow) {
        return (
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <Route path={CustomerRouter.registerPage} component={CustomerRegisterPage}/>
                    <Route path={CustomerRouter.loginPage} component={CustomerLoginPage}/>
                    <Route path={EnterpriseRouter.loginPage} component={EnterpriseLoginPage}/>
                    <Route path={AdminRouter.loginPage} component={AdminLoginPage}/>
                    {
                        localStorage.getItem(CURRENT_USER_ROLE) == UserRole.ENTERPRISE_MANAGER ? (
                            <EnterprisePageContainer/>
                        ) : localStorage.getItem(CURRENT_USER_ROLE) == UserRole.ADMIN ? (
                            <AdminPageContainer/>
                        ) : (
                            <CustomerPageContainer/>
                        )
                    }
                </ThemeProvider>
            </BrowserRouter>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default PageContainer;
