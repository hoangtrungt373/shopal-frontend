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
import {CURRENT_USER_ROLE} from "../config/constants";
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
import EnterprisePurchaseOrderManagementPage from "./enterprise/ordermanagement/EnterprisePurchaseOrderManagementPage";
import EnterpriseCooperationContractManagementPage
    from "./enterprise/cooperationcontractmanagement/EnterpriseCooperationContractManagementPage";
import Toolbar from "@mui/material/Toolbar";
import EnterpriseAccountingPage from "./enterprise/accounting/EnterpriseAccountingPage";
import EnterpriseAccountingDetailPage from "./enterprise/accountingdetail/EnterpriseAccountingDetailPage";
import EnterpriseProductCollectionPage from "./enterprise/product/EnterpriseProductCollectionPage";
import EnterpriseProductDetailPage from "./enterprise/productdetail/EnterpriseProductDetailPage";
import AdminCreateOrUpdateProductPage from "./admin/newproduct/AdminCreateOrUpdateProductPage";
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
import {isCurrentScreenIsLoginOrRegisterPage} from "../util/display.util";
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
import '../../theme.scss'
import EnterpriseDashboardPage from "./enterprise/dashboard/EnterpriseDashboardPage";
import AdminCustomerManagementPage from "./admin/customermanagement/AdminCustomerManagementPage";
import AdminCustomerDetailPage from "./admin/customerdetail/AdminCustomerDetailPage";
import EnterpriseCustomerMembershipManagementPage
    from './enterprise/customermembershipmanagement/EnterpriseCustomerMembershipManagementPage';
import {getCurrentEnterpriseInfo} from "../service/enterprise.service";
import EnterpriseCustomerMembershipDetailPage from "./enterprise/customerdetail/EnterpriseCustomerMembershipDetailPage";
import EnterpriseCustomerRegisterManagementPage
    from "./enterprise/customerregistermanagement/EnterpriseCustomerRegisterManagementPage";
import AdminPurchaseOrderDetailPage from "./admin/orderdetail/AdminPurchaseOrderDetailPage";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import EnterpriseNotificationPage from "./enterprise/notification/EnterpriseNotificationPage";
import EnterprisePurchaseOrderDetailPage from "./enterprise/orderdetail/EnterprisePurchaseOrderDetailPage";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EnterpriseProfilePage from "./enterprise/profile/EnterpriseProfilePage";
import AdminEnterpriseRegisterRequestManagementPage
    from "./admin/enterpriseregistermanagement/AdminEnterpriseRegisterRequestManagementPage";
import AdminCooperationContractRequestManagementPage
    from "./admin/contractrequestmanagement/AdminCooperationContractRequestManagementPage";
import AdminProductSellingRequestManagementPage
    from './admin/requestsellingproductmanagement/AdminProductSellingRequestManagementPage';
import {CustomerCheckoutHeader} from "./common/customer/CustomerCheckoutHeader";
import AdminCooperationContractManagementPage from "./admin/contractmanagement/AdminCooperationContractManagementPage";
import AdminAccountingManagementPage from "./admin/accountingmanagement/AdminAccountingManagementPage";
import {CustomerHomeFooter} from "./common/customer/CustomerHomeFooter";

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
        title: "ENTERPRISES",
        icon: <ApartmentIcon/>,
        subItems: [
            {
                title: "Cooperation Requests",
                url: AdminRouter.enterpriseRegisterRequestManagement,
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
        url: AdminRouter.customerManagementPage,
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
            },
            {
                title: "Request sell",
                url: AdminRouter.requestSellingProductManagement,
            }
        ]
    },
    {
        title: "ORDERS",
        icon: <ShoppingCartIcon/>,
        url: AdminRouter.purchaseOrderManagementPage
    },
    {
        title: "CONTRACTS",
        icon: <LocalOfferIcon/>,
        subItems: [
            {
                title: "Contract Request",
                url: AdminRouter.cooperationContractRequestManagement,
            },
            {
                title: "Contract List",
                url: AdminRouter.cooperationContractManagement,
            }
        ]
    },
    {
        title: "ACCOUNTINGS",
        url: AdminRouter.accountingPage,
        icon: <ReceiptIcon/>
    },
]

const enterpriseListItems: SideBarListItem[] = [
    {
        title: "DASHBOARD",
        url: EnterpriseRouter.dashboardPage,
        icon: <DashboardIcon/>,
    },
    {
        title: "PROFILE",
        url: EnterpriseRouter.profilePage,
        icon: <AccountBoxIcon/>,
    },
    {
        title: "CUSTOMERS",
        icon: <GroupIcon/>,
        subItems: [
            {
                title: "Membership Customers",
                url: EnterpriseRouter.customerMembershipManagementPage,
            },
            {
                title: "Register Customers",
                url: EnterpriseRouter.customerRegisterManagementPage
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
    {
        title: "NOTIFICATIONS",
        url: EnterpriseRouter.notificationPage,
        icon: <NotificationsNoneIcon/>
    },

]

const PageContainer = () => {

    const [currentCustomer, setCurrentCustomer] = useState<Customer>();
    const [currentEnterprise, setCurrentEnterprise] = useState<Enterprise>();
    const [isShow, setIsShow] = useState<boolean>(false);

    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
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
            } else if (localStorage.getItem(CURRENT_USER_ROLE) == UserRole.ENTERPRISE_MANAGER) {
                getCurrentEnterpriseInfo()
                    .then((resEnterprise: Enterprise) => {
                        setCurrentEnterprise(resEnterprise);
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
    }, [window.location.href]);

    if (isShow) {
        if (localStorage.getItem(CURRENT_USER_ROLE) == UserRole.ENTERPRISE_MANAGER) {
            return (
                <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>
                        <Route path={EnterpriseRouter.loginPage} component={EnterpriseLoginPage}/>
                        <Box sx={{display: 'flex'}}>
                            <Route
                                path={[EnterpriseRouter.dashboardPage, EnterpriseRouter.customerRegisterManagementPage, EnterpriseRouter.customerMembershipManagementPage,
                                    EnterpriseRouter.customerMembershipDetailPage + "/*", EnterpriseRouter.purchaseOrderManagement,
                                    EnterpriseRouter.productCollectionPage, EnterpriseRouter.productDetailPage + "/*", EnterpriseRouter.cooperationContractManagement, EnterpriseRouter.accounting + "/*",
                                    EnterpriseRouter.notificationPage, EnterpriseRouter.purchaseOrderDetailPage + "/*", EnterpriseRouter.profilePage, EnterpriseRouter.accounting]}
                                exact
                                component={() => (<AdminAppBar open={open} toggleDrawer={toggleDrawer}
                                                               currentEnterprise={currentEnterprise}
                                                               userRole={UserRole.ENTERPRISE_MANAGER}/>)}/>
                            <Route
                                path={[EnterpriseRouter.dashboardPage, EnterpriseRouter.customerRegisterManagementPage, EnterpriseRouter.customerMembershipManagementPage,
                                    EnterpriseRouter.customerMembershipDetailPage + "/*", EnterpriseRouter.purchaseOrderManagement,
                                    EnterpriseRouter.productCollectionPage, EnterpriseRouter.productDetailPage + "/*", EnterpriseRouter.cooperationContractManagement, EnterpriseRouter.accounting + "/*",
                                    EnterpriseRouter.notificationPage, EnterpriseRouter.purchaseOrderDetailPage + "/*", EnterpriseRouter.profilePage, EnterpriseRouter.accounting]}
                                exact
                                component={() => (<AdminDrawer open={open} toggleDrawer={toggleDrawer}
                                                               content={<MainSideBarListItem
                                                                   items={enterpriseListItems}/>}/>)}/>
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
                                                    <PrivateRoute path={EnterpriseRouter.profilePage}
                                                                  currentEnterprise={currentEnterprise}
                                                                  component={EnterpriseProfilePage} exact/>
                                                    <PrivateRoute
                                                        path={EnterpriseRouter.customerMembershipManagementPage}
                                                        component={EnterpriseCustomerMembershipManagementPage} exact
                                                        currentEnterprise={currentEnterprise}/>
                                                    <PrivateRoute
                                                        path={EnterpriseRouter.customerRegisterManagementPage}
                                                        component={EnterpriseCustomerRegisterManagementPage} exact
                                                        currentEnterprise={currentEnterprise}/>
                                                    <PrivateRoute
                                                        path={EnterpriseRouter.customerMembershipDetailPage + "/*.:customerId"}
                                                        component={EnterpriseCustomerMembershipDetailPage} exact
                                                        currentEnterprise={currentEnterprise}/>
                                                    <PrivateRoute path={EnterpriseRouter.purchaseOrderManagement}
                                                                  component={EnterprisePurchaseOrderManagementPage}
                                                                  currentEnterprise={currentEnterprise}
                                                                  exact/>
                                                    <PrivateRoute
                                                        path={EnterpriseRouter.purchaseOrderDetailPage + "/*.:purchaseOrderId"}
                                                        component={EnterprisePurchaseOrderDetailPage}
                                                        currentEnterprise={currentEnterprise}
                                                        exact/>
                                                    <PrivateRoute path={EnterpriseRouter.productCollectionPage}
                                                                  component={EnterpriseProductCollectionPage}
                                                                  currentEnterprise={currentEnterprise}
                                                                  exact/>
                                                    <PrivateRoute
                                                        path={EnterpriseRouter.productDetailPage + "/*.:productId"}
                                                        component={EnterpriseProductDetailPage}
                                                        currentEnterprise={currentEnterprise} exact/>
                                                    <PrivateRoute
                                                        path={EnterpriseRouter.cooperationContractManagement}
                                                        component={EnterpriseCooperationContractManagementPage}
                                                        currentEnterprise={currentEnterprise}
                                                        exact/>
                                                    <PrivateRoute path={EnterpriseRouter.accounting}
                                                                  currentEnterprise={currentEnterprise}
                                                                  component={EnterpriseAccountingPage} exact/>
                                                    <PrivateRoute
                                                        path={EnterpriseRouter.accounting + "/*.:accountingId"}
                                                        component={EnterpriseAccountingDetailPage}
                                                        currentEnterprise={currentEnterprise}/>
                                                    <PrivateRoute
                                                        path={EnterpriseRouter.notificationPage}
                                                        component={EnterpriseNotificationPage}
                                                        currentEnterprise={currentEnterprise}/>
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
                                !isCurrentScreenIsLoginOrRegisterPage(window.location.href) && (
                                    <React.Fragment>
                                        <AdminAppBar open={open} toggleDrawer={toggleDrawer} userRole={UserRole.ADMIN}
                                                     currentEnterprise={null}/>
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
                                                    <PrivateRoute path={AdminRouter.customerManagementPage}
                                                                  component={AdminCustomerManagementPage} exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.customerManagementPage + "/*.:customerId"}
                                                        component={AdminCustomerDetailPage}/>
                                                    <PrivateRoute path={AdminRouter.childCatalogManagementPage}
                                                                  component={AdminChildCatalogManagementPage}
                                                                  exact/>
                                                    <PrivateRoute path={AdminRouter.enterpriseManagement}
                                                                  component={AdminEnterpriseManagementPage} exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.enterpriseRegisterRequestManagement}
                                                        component={AdminEnterpriseRegisterRequestManagementPage} exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.cooperationContractRequestManagement}
                                                        component={AdminCooperationContractRequestManagementPage}
                                                        exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.cooperationContractManagement}
                                                        component={AdminCooperationContractManagementPage}
                                                        exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.requestSellingProductManagement}
                                                        component={AdminProductSellingRequestManagementPage}
                                                        exact/>
                                                    <PrivateRoute path={AdminRouter.productCollectionPage}
                                                                  component={AdminProductCollectionPage}
                                                                  exact/>
                                                    <PrivateRoute path={AdminRouter.purchaseOrderManagementPage}
                                                                  component={AdminPurchaseOrderManagementPage}
                                                                  exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.purchaseOrderDetailPage + "/*.:purchaseOrderId"}
                                                        component={AdminPurchaseOrderDetailPage}
                                                        exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.productDetailPage + "/*.:productId"}
                                                        component={AdminProductDetailPage} exact/>
                                                    <PrivateRoute path={AdminRouter.newProductPage}
                                                                  component={AdminCreateOrUpdateProductPage} exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.editProductPage + "/*.:productId"}
                                                        component={AdminCreateOrUpdateProductPage} exact/>
                                                    <PrivateRoute
                                                        path={AdminRouter.accountingPage}
                                                        component={AdminAccountingManagementPage} exact/>
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
                        <Route
                            path={[CustomerRouter.homePage, CustomerRouter.productCollectionPage, CustomerRouter.productDetailPage + "/*",
                                CustomerRouter.cartPage, CustomerRouter.dashBoardPage, CustomerRouter.membershipPage, CustomerRouter.purchasedOrderHistory,
                                CustomerRouter.updateEmailPage, CustomerRouter.updatePhoneNumberPage]}
                            exact
                            component={() => (<CustomerHomeHeader currentCustomer={currentCustomer}/>)}/>
                        <Route
                            path={[CustomerRouter.checkoutPage, CustomerRouter.checkoutSuccess]}
                            exact
                            component={() => (<CustomerCheckoutHeader/>)}/>

                        <Switch>
                            <Route path={CustomerRouter.registerPage} component={CustomerRegisterPage}/>
                            <Route path={CustomerRouter.loginPage} component={CustomerLoginPage}/>
                            <Route path={EnterpriseRouter.registerPage} component={EnterpriseRegisterPage}/>
                            <Route path={EnterpriseRouter.loginPage} component={EnterpriseLoginPage}/>
                            <Route path={AdminRouter.loginPage} component={AdminLoginPage}/>
                        </Switch>
                        <Box>
                            <Container maxWidth="lg" sx={{marginBottom: "24px", minHeight: "500px"}}>
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
                                    <PrivateRoute path={CustomerRouter.dashBoardPage} currentCustomer={currentCustomer}
                                                  component={CustomerDashboardPage}/>
                                </Switch>
                            </Container>
                            <CustomerHomeFooter/>
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
