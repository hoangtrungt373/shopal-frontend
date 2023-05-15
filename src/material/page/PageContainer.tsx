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
import EnterpriseAccountingPage from "./enterprise/accounting/EnterpriseAccountingPage";
import EnterpriseAccountingDetailPage from "./enterprise/accountingdetail/EnterpriseAccountingDetailPage";
import EnterprisePurchaseOrderDetailPage from "./enterprise/orderdetail/EnterprisePurchaseOrderDetailPage";
import EnterpriseProductCollectionPage from "./enterprise/product/EnterpriseProductCollectionPage";
import EnterpriseProductDetailPage from "./enterprise/productdetail/EnterpriseProductDetailPage";
import AdminNewProductPage from "./admin/newproduct/AdminNewProductPage";
import AdminAppBar from "./common/admin/AdminAppBar";
import AdminDrawer from "./common/admin/AdminDrawer";
import AdminDashboardPage from './admin/dahboard/AdminDashboardPage';
import AdminLoginPage from './admin/login/AdminLoginPage';
import AdminCatalogManagementPage from "./admin/catalog/AdminCatalogManagementPage";
import AdminChildCatalogManagementPage from "./admin/childcatalog/AdminChildCatalogManagementPage";
import AdminProductCollectionPage from "./admin/product/AdminProductCollectionPage";
import AdminProductDetailPage from "./admin/productdetail/AdminProductDetailPage";
import AdminPurchaseOrderManagementPage from "./admin/ordermanagement/AdminPurchaseOrderManagementPage";
import EnterpriseRegisterPage from './enterprise/register/EnterpriseRegisterPage';
import {isCurrentScreenIsLoginOrRegisterPage} from "../util/other.util";
import {MainSideBarListItem, SideBarListItem} from "./common/share/MainSideBarListItem";
import {CopyRight} from './common/share/CopyRight';
import DashboardIcon from "@mui/icons-material/Dashboard";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CategoryIcon from "@mui/icons-material/Category";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GroupIcon from '@mui/icons-material/Group';
import AdminEnterpriseManagementPage from "./admin/enterprises/AdminEnterpriseManagementPage";
import AdminEnterpriseCooperationRequestManagementPage
    from "./admin/cooperationrequestmanagement/AdminEnterpriseCooperationRequestManagementPage";
import '../../theme.scss'
import EnterpriseDashboardPage from "./enterprise/dashboard/EnterpriseDashboardPage";

const theme = createTheme({
    typography: {
        body1: {
            fontSize: 14
        },
        button: {
            fontSize: 14,
            textTransform: "initial"
        },
    },
    palette: {
        primary: {
            light: "#40a9ff",
            main: "#1890ff",
            dark: '#096dd9',
            contrastText: '#fff'
        },
        error: {
            light: "#ff4d4f",
            main: "#f5222d",
            dark: '#cf1322',
            contrastText: '#fff'
        },
        success: {
            light: "#73d13d",
            main: "#52c41a",
            dark: '#389e0d',
            contrastText: '#fff'
        }
    },
});

const adminListItems: SideBarListItem[] = [
    {
        title: "DASHBOARD",
        url: AdminRouter.dashboardPage,
        icon: <DashboardIcon/>,
    },
    {
        title: "ENTERPRISES",
        icon: <ApartmentIcon/>,
        subItems: [
            {
                title: "Cooperation Requests",
                url: AdminRouter.enterpriseCooperationRequestManagement,
            },
            {
                title: "Enterprise List",
                url: AdminRouter.enterpriseManagement,
            }
        ]
    },
    {
        title: "CUSTOMERS",
        icon: <GroupIcon/>,
    },
    {
        title: "CATEGORIES",
        icon: <CategoryIcon/>,
        subItems: [
            {
                title: "Main Categories",
                url: AdminRouter.catalogManagementPage,
            },
            {
                title: "Sub Categories",
                url: AdminRouter.childCatalogManagementPage,
            }
        ]
    },
    {
        title: "PRODUCTS",
        icon: <ViewInArIcon/>,
        subItems: [
            {
                title: "New Product",
                url: AdminRouter.newProductPage,
            },
            {
                title: "Product List",
                url: AdminRouter.productCollectionPage,
            }
        ]
    },
    {
        title: "ORDERS",
        icon: <ShoppingCartIcon/>,
        url: AdminRouter.dashboardPage
    },
    {
        title: "CONTRACTS",
        icon: <LocalOfferIcon/>,
        url: AdminRouter.dashboardPage
    },
    {
        title: "ACCOUNTINGS",
        icon: <ReceiptIcon/>,
        url: AdminRouter.dashboardPage
    },

]

const enterpriseListItems: SideBarListItem[] = [
    {
        title: "DASHBOARD",
        url: EnterpriseRouter.dashboardPage,
        icon: <DashboardIcon/>,
    },
    {
        title: "CUSTOMERS",
        icon: <GroupIcon/>,
        subItems: [
            {
                title: "Membership Customers",
                url: EnterpriseRouter.customerManagementPage,
            },
            {
                title: "Register Customers",
                url: EnterpriseRouter.customerManagementPage,
            }
        ]
    },
    {
        title: "PRODUCTS",
        icon: <ViewInArIcon/>,
        url: EnterpriseRouter.productCollectionPage
    },
    {
        title: "ORDERS",
        url: EnterpriseRouter.purchaseOrderManagement,
        icon: <ShoppingCartIcon/>
    },
    {
        title: "CONTRACTS",
        url: EnterpriseRouter.cooperationContractManagement,
        icon: <LocalOfferIcon/>
    },
    {
        title: "ACCOUNTINGS",
        url: EnterpriseRouter.accounting,
        icon: <ReceiptIcon/>
    },

]

const PageContainer = () => {

    const [currentCustomer, setCurrentCustomer] = useState<Customer>();
    const [currentScreen, setCurrentScreen] = useState<string>();
    const [currentEnterprise, setCurrentEnterprise] = useState<Enterprise>();
    const [isShow, setIsShow] = useState<boolean>(false);

    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        console.log(localStorage.getItem(CURRENT_USER_ROLE));
        console.log(localStorage.getItem(ACCESS_TOKEN));
        setCurrentScreen(window.location.href)
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

    if (isShow) {
        if (localStorage.getItem(CURRENT_USER_ROLE) == UserRole.ENTERPRISE_MANAGER) {
            return (
                <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>
                        <Route path={EnterpriseRouter.loginPage} component={EnterpriseLoginPage}/>
                        <Box sx={{display: 'flex'}}>
                            {
                                !isCurrentScreenIsLoginOrRegisterPage(currentScreen) && (
                                    <React.Fragment>
                                        <AdminAppBar open={open} toggleDrawer={toggleDrawer}
                                                     userRole={UserRole.ENTERPRISE_MANAGER}/>
                                        <AdminDrawer open={open} toggleDrawer={toggleDrawer}
                                                     content={<MainSideBarListItem items={enterpriseListItems}/>}/>
                                    </React.Fragment>
                                )
                            }
                            <Box
                                component="main"
                                sx={{
                                    backgroundColor: "#FDFDFD",
                                    flexGrow: 1,
                                    overflow: 'auto',
                                    marginLeft: "250px"
                                }}
                            >
                                <Toolbar/>
                                <Container maxWidth="lg" sx={{my: 4}}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                                <Switch>
                                                    <PrivateRoute path={EnterpriseRouter.dashboardPage}
                                                                  component={EnterpriseDashboardPage} exact/>
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
                                </Container>
                                <CopyRight url={EnterpriseRouter.dashboardPage}/>
                            </Box>
                        </Box>
                    </ThemeProvider>
                </BrowserRouter>
            )

        } else if (localStorage.getItem(CURRENT_USER_ROLE) == UserRole.ADMIN) {

            return (
                <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>
                        <Route path={CustomerRouter.registerPage} component={CustomerRegisterPage}/>
                        <Route path={CustomerRouter.loginPage} component={CustomerLoginPage}/>
                        <Route path={EnterpriseRouter.registerPage} component={EnterpriseRegisterPage}/>
                        <Route path={EnterpriseRouter.loginPage} component={EnterpriseLoginPage}/>
                        <Route path={AdminRouter.loginPage} component={AdminLoginPage}/>
                        <Box sx={{display: 'flex'}}>
                            {
                                !isCurrentScreenIsLoginOrRegisterPage(currentScreen) && (
                                    <React.Fragment>
                                        <AdminAppBar open={open} toggleDrawer={toggleDrawer} userRole={UserRole.ADMIN}/>
                                        <AdminDrawer open={open} toggleDrawer={toggleDrawer}
                                                     content={<MainSideBarListItem items={adminListItems}/>}/>
                                    </React.Fragment>
                                )
                            }
                            <Box
                                component="main"
                                sx={{
                                    backgroundColor: "#FDFDFD",
                                    flexGrow: 1,
                                    overflow: 'auto',
                                    marginLeft: "250px"
                                }}
                            >
                                <Toolbar/>
                                <Container maxWidth="lg" sx={{my: 4}}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                                <Switch>
                                                    <PrivateRoute path={AdminRouter.dashboardPage}
                                                                  component={AdminDashboardPage} exact/>
                                                    <PrivateRoute path={AdminRouter.catalogManagementPage}
                                                                  component={AdminCatalogManagementPage} exact/>
                                                    <PrivateRoute path={AdminRouter.childCatalogManagementPage}
                                                                  component={AdminChildCatalogManagementPage}
                                                                  exact/>
                                                    <PrivateRoute path={AdminRouter.enterpriseManagement}
                                                                  component={AdminEnterpriseManagementPage} exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.enterpriseCooperationRequestManagement}
                                                        component={AdminEnterpriseCooperationRequestManagementPage}
                                                        exact/>
                                                    <PrivateRoute path={AdminRouter.productCollectionPage}
                                                                  component={AdminProductCollectionPage}
                                                                  exact/>
                                                    <PrivateRoute path={AdminRouter.purchaseOrderManagement}
                                                                  component={AdminPurchaseOrderManagementPage}
                                                                  exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.productCollectionPage + "/*.:productId"}
                                                        component={AdminProductDetailPage}/>
                                                    <PrivateRoute path={AdminRouter.newProductPage}
                                                                  component={AdminNewProductPage} exact/>
                                                </Switch>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Container>
                                <CopyRight url={AdminRouter.dashboardPage}/>
                            </Box>
                        </Box>
                    </ThemeProvider>
                </BrowserRouter>
            )

        } else {
            return (
                <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>
                        <Route path={CustomerRouter.registerPage} component={CustomerRegisterPage}/>
                        <Route path={CustomerRouter.loginPage} component={CustomerLoginPage}/>
                        <Route path={EnterpriseRouter.registerPage} component={EnterpriseRegisterPage}/>
                        <Route path={EnterpriseRouter.loginPage} component={EnterpriseLoginPage}/>
                        <Route path={AdminRouter.loginPage} component={AdminLoginPage}/>
                        <Box>
                            {
                                !isCurrentScreenIsLoginOrRegisterPage(currentScreen) && (
                                    <React.Fragment>
                                        <CustomerHomeHeader currentCustomer={currentCustomer}/>
                                    </React.Fragment>
                                )
                            }
                            <Container maxWidth="lg" sx={{marginBottom: "24px"}}>
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
                    </ThemeProvider>
                </BrowserRouter>
            )
        }
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default PageContainer;
