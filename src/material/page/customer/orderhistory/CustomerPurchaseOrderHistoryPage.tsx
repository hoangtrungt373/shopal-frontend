import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {CustomerPurchaseOrder} from "../../../model/customer/CustomerPurchaseOrder";
import {getAllOrderStatus, getAllPurchaseOrderForCurrentCustomer} from "../../../service/order.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {OrderStatus} from "../../../model/enums/OrderStatus";
import {Tabs} from "@mui/material";
import Tab from "@mui/material/Tab";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Divider from "@mui/material/Divider";
import {AssetPath} from "../../../config/router";
import Avatar from "@mui/material/Avatar";
import PageSpinner from "../../common/share/PageSpinner";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";


interface Props {
    children?: React.ReactNode;
    index?: number;
    value?: number;
    customerPurchaseOrders?: CustomerPurchaseOrder[]
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props: Props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const PurchaseOrderList: React.FC<Props> = ({customerPurchaseOrders}) => {

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            {
                customerPurchaseOrders.map((customerPurchaseOrder, index1) => (
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        backgroundColor: "#fff",
                        p: 2,
                        borderRadius: 2
                    }}
                         key={index1}>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                            <LocalShippingOutlinedIcon/>
                            <Typography>{customerPurchaseOrder.orderStatusDescription}</Typography>
                        </Box>
                        <Divider/>
                        {
                            customerPurchaseOrder.purchaseProducts.map((purchaseProduct, index2) => (
                                <Box>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Box sx={{display: "flex", gap: 2}}>
                                            <img src={`${AssetPath.productImgUrl}${purchaseProduct.mainImgUrl}`}
                                                 alt={"img"}
                                                 style={{
                                                     width: "80px",
                                                     display: "block",
                                                 }}/>
                                            <Box sx={{display: "flex", gap: 1, flexDirection: "column"}}>
                                                <Typography>{purchaseProduct.productName}</Typography>
                                                <Typography>x{purchaseProduct.amount}</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            display: "flex",
                                            gap: 0.5,
                                            alignItems: "center",
                                        }}>
                                            <Typography>{purchaseProduct.pointExchange}</Typography>
                                            <Avatar alt="img"
                                                    src={AssetPath.enterpriseLogoUrl + customerPurchaseOrder.enterprise.logoUrl}
                                                    sx={{width: 15, height: 15}}/>
                                        </Box>
                                    </Box>
                                    <Divider sx={{marginTop: 2}}/>
                                </Box>

                            ))
                        }
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            marginLeft: "auto",
                            alignItems: "flex-end"
                        }}>
                            <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                <Typography
                                    fontSize={"16px"}>Total: {customerPurchaseOrder.orderTotalPointExchange}</Typography>
                                <Avatar alt="img"
                                        src={AssetPath.enterpriseLogoUrl + customerPurchaseOrder.enterprise.logoUrl}
                                        sx={{width: 20, height: 20}}/>
                            </Box>
                            <Link to={"/"}><Button variant={"contained"}>See detail</Button></Link>
                        </Box>
                    </Box>
                ))
            }
        </Box>
    )
}

const CustomerPurchaseOrderHistoryPage: React.FC<Props> = () => {

    const [customerPurchaseOrders, setCustomerPurchaseOrders] = useState<CustomerPurchaseOrder[]>([]);
    const [orderStatusList, setOrderStatusList] = useState<OrderStatus[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);

    const [orderStatusTab, setOrderStatusTab] = useState<number>(0);

    useEffect(() => {
        getAllPurchaseOrderForCurrentCustomer()
            .then((resCustomerPurchaseOrders: CustomerPurchaseOrder[]) => {
                setCustomerPurchaseOrders(resCustomerPurchaseOrders);
                getAllOrderStatus()
                    .then((resOrderStatusList: OrderStatus[]) => {
                    })
                    .catch((err: ExceptionResponse) => {
                        console.log(err);
                    })
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
            .finally(() => {
                setIsShow(true);
            });
    }, []);

    const handleChangeOrderStatusTab = (event: React.SyntheticEvent, newOrderStatusTabValue: number) => {
        setOrderStatusTab(newOrderStatusTabValue);
    };

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <Typography variant={"h6"} mb={2}>My Purchase</Typography>
            <Box
                sx={{backgroundColor: "#fff", borderRadius: 2}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={orderStatusTab} onChange={handleChangeOrderStatusTab}
                          aria-label="basic tabs example">
                        <Tab label="ALL" {...a11yProps(0)} />
                        <Tab label="Processing" {...a11yProps(1)} />
                        <Tab label="In transit" {...a11yProps(2)} />
                        <Tab label="Delivered" {...a11yProps(3)} />
                    </Tabs>
                </Box>
            </Box>
            <Box>

            </Box>
            {
                isShow ? (
                    <Box>
                        <TabPanel value={orderStatusTab} index={0}>
                            {
                                customerPurchaseOrders && (
                                    <PurchaseOrderList customerPurchaseOrders={customerPurchaseOrders}/>
                                )
                            }
                        </TabPanel>
                        <TabPanel value={orderStatusTab} index={1}>
                            Processing
                        </TabPanel>
                        <TabPanel value={orderStatusTab} index={2}>
                            In transit
                        </TabPanel>
                        <TabPanel value={orderStatusTab} index={3}>
                            Delivered
                        </TabPanel>
                    </Box>
                ) : (
                    <PageSpinner/>
                )
            }
        </Box>
    );
}

export default CustomerPurchaseOrderHistoryPage;