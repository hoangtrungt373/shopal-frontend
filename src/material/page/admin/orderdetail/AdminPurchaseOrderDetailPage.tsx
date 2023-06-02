import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Step, StepConnector, stepConnectorClasses, StepIconProps, StepLabel, Stepper} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {AdminRouter, AssetPath} from "../../../config/router";
import PageSpinner from "../../common/share/PageSpinner";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {getPurchaseOrderByCriteria, updatePurchaseOrderStatus} from "../../../service/order.service";
import Divider from "@mui/material/Divider";
import {styled} from '@mui/material/styles';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import HailOutlinedIcon from '@mui/icons-material/HailOutlined';
import {OrderStatus} from "../../../model/enums/OrderStatus";
import AlertDialog from "../../common/share/AlertDialog";
import Avatar from "@mui/material/Avatar";
import {createSeoLink, formatVndMoney} from "../../../util/display.util";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import PageHeader from "../../common/share/PageHeader";
import {PurchaseOrder} from "../../../model/PurchaseOrder";
import CancelIcon from '@mui/icons-material/Cancel';
import {cancelReasonOptions} from "../../customer/orderhistory/CustomerPurchaseOrderHistoryPage";

interface RouteParams {
    purchaseOrderId: any;
}

interface OrderStatusStep {
    label: string,
    value: OrderStatus
}

interface Props {
    purchaseOrder?: PurchaseOrder,
    title?: string,
    info?: any,
    onUpdateOrderStatus?: Function
}

const OrderInfoBlock: React.FC<Props> = ({title, info}) => {

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
        }}>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#F7F7F7",
                p: 2,
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                border: '1px solid #e1e2e6'
            }}>
                <Typography fontWeight={"bold"} color={"#56606e"}>{title}</Typography>
            </Box>
            <Box sx={{
                p: 2, color: '#757575',
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
                border: '1px solid #e1e2e6',
                height: "150px"
            }}>
                {info}
            </Box>
        </Box>
    )
}

const ProductSummary: React.FC<Props> = ({purchaseOrder}) => {


    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                backgroundColor: "#F7F7F7",
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2
            }}>
                <Typography fontSize={"16px"} fontWeight={"bold"} color={"#56606e"}>PRODUCT SUMMARY</Typography>
            </Box>
            <Grid container spacing={2} p={1} mt={1} alignItems={"center"}
                  justifyContent={"space-between"}>
                <Grid item xs={2}>
                    <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <Box sx={{width: "30%"}}>
                            <Typography align={"left"} fontWeight={"bold"} color={"#56606e"}>#</Typography>
                        </Box>
                        <Box sx={{width: "70%"}}>
                            <Typography fontWeight={"bold"} color={"#56606e"}>Image</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Typography fontWeight={"bold"} color={"#56606e"}>Product</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography align={"center"} fontWeight={"bold"} color={"#56606e"}>Point/Unit</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography align={"center"} fontWeight={"bold"} color={"#56606e"}>Cash/Unit</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography align={"center"} fontWeight={"bold"} color={"#56606e"}>Quantity</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography align={"center"} fontWeight={"bold"} color={"#56606e"}>Subtotal Point</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography align={"right"} fontWeight={"bold"} color={"#56606e"}>Subtotal Cash</Typography>
                </Grid>
            </Grid>
            {
                purchaseOrder.purchaseProducts.map((purchaseProduct, index) => {

                    return (
                        <Box sx={{backgroundColor: index % 2 == 0 ? "#F9F9F9" : "#fff"}}>
                            <Grid container spacing={2} p={1} alignItems={"center"} justifyContent={"space-between"}>
                                <Grid item xs={2}>
                                    <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                        <Box sx={{width: "30%"}}>
                                            <Typography>{index}</Typography>
                                        </Box>
                                        <Box sx={{width: "70%"}}>
                                            <img src={`${AssetPath.productImgUrl}${purchaseProduct.product.mainImgUrl}`}
                                                 alt={"img"}
                                                 style={{
                                                     width: "50px",
                                                     display: "block"
                                                 }}/>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Link style={{width: "100%"}}
                                          to={AdminRouter.productDetailPage + "/" + createSeoLink(purchaseProduct.product.productName) + "." + purchaseProduct.product.id}
                                          className={"productName"}>{purchaseProduct.product.productName}</Link>
                                </Grid>
                                <Grid item xs={1}>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 0.5,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <Typography align={"center"}>{purchaseProduct.pointExchange}</Typography>
                                        <Avatar alt="img"
                                                src={AssetPath.enterpriseLogoUrl + purchaseOrder.enterprise.logoUrl}
                                                sx={{width: 20, height: 20}}/>
                                    </Box>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography
                                        align={"center"}>{formatVndMoney(purchaseProduct.product.initialCash)}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography align={"center"}>{purchaseProduct.amount}</Typography>
                                </Grid>
                                <Grid item xs={1}>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 0.5,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <Typography align={"right"}>{purchaseProduct.totalPointExchange}</Typography>
                                        <Avatar alt="img"
                                                src={AssetPath.enterpriseLogoUrl + purchaseOrder.enterprise.logoUrl}
                                                sx={{width: 20, height: 20}}/>
                                    </Box>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography
                                        align={"right"}>{formatVndMoney(purchaseProduct.totalCash)}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )
                })
            }
            <Divider/>
            <Box
                style={{backgroundColor: purchaseOrder.purchaseProducts.length % 2 == 0 ? "#F9F9F9" : "#fff"}}>
                <Grid container spacing={2} p={1} alignItems={"center"}>
                    <Grid item xs={10}>
                        <Typography align={"right"} fontWeight={"bold"}>Total point:</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Box sx={{display: "flex", gap: 0.5, alignItems: "center", justifyContent: "flex-end"}}>
                            <Typography align={"right"}
                                        fontWeight={"bold"}>{purchaseOrder.orderTotalPointExchange}</Typography>
                            <Avatar alt="img"
                                    src={AssetPath.enterpriseLogoUrl + purchaseOrder.enterprise.logoUrl}
                                    sx={{width: 20, height: 20}}/>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box
                style={{backgroundColor: purchaseOrder.purchaseProducts.length % 2 != 0 ? "#F9F9F9" : "#fff"}}>
                <Grid container spacing={2} p={1} alignItems={"center"}>
                    <Grid item xs={10}>
                        <Typography align={"right"} fontWeight={"bold"}>To cash (VND):</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align={"right"}
                                    fontWeight={"bold"}>{formatVndMoney(purchaseOrder.orderTotalCash)}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box
                style={{backgroundColor: purchaseOrder.purchaseProducts.length % 2 == 0 ? "#F9F9F9" : "#fff"}}>
                <Grid container spacing={2} p={1} alignItems={"center"} justifyContent={"flex-end"}>
                    <Grid item xs={10}>
                        <Typography align={"right"} fontWeight={"bold"}>Order Status:</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align={"right"}
                                    fontWeight={"bold"}>{purchaseOrder.orderStatusDescription}</Typography>
                    </Grid>
                </Grid>
            </Box>


        </Box>
    )
}

const TrackingOrder: React.FC<Props> = ({purchaseOrder, onUpdateOrderStatus}) => {

    const [currentOrderStep, setCurrentOrderStep] = useState<number>(0);
    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "Update order status",
        content: null,
        acceptText: "Accept",
        deniedText: "Denied",
        handleDenied: null,
        handleAccept: null
    });


    useEffect(() => {
        switch (purchaseOrder.orderStatus) {
            case OrderStatus.OPEN: {
                setCurrentOrderStep(0);
                break;
            }
            case OrderStatus.PROCESSING: {
                setCurrentOrderStep(1);
                break;
            }
            case OrderStatus.IN_TRANSIT: {
                setCurrentOrderStep(2);
                break;
            }
            case OrderStatus.DELIVERED: {
                setCurrentOrderStep(3);
                break;
            }
            case OrderStatus.CANCELLED: {
                setCurrentOrderStep(2);
                break;
            }
        }
    }, [purchaseOrder])

    const orderStatusSteps: OrderStatusStep[] = [
        {
            label: "Open",
            value: OrderStatus.OPEN
        },
        {
            label: "Processing",
            value: OrderStatus.PROCESSING
        },
        {
            label: "In transit",
            value: OrderStatus.IN_TRANSIT
        },
        {
            label: "Delivered",
            value: OrderStatus.DELIVERED
        },
    ];

    const orderStatusCancelSteps: OrderStatusStep[] = [
        {
            label: "Open",
            value: OrderStatus.OPEN
        },
        {
            label: "Cancelled",
            value: OrderStatus.CANCELLED
        },
    ];

    const ColorlibConnector = styled(StepConnector)(({theme}) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 22,
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor: "#88AAF3",
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundColor: "#88AAF3",
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor: "#E1E7EC",
            borderRadius: 1,
        },
    }));

    const ColorlibStepIconRoot = styled('div')<{
        ownerState: { completed?: boolean; active?: boolean };
    }>(({theme, ownerState}) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: "pointer",
        ...(ownerState.active && {
            backgroundColor: "#88AAF3",
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
        }),
        ...(ownerState.completed && {
            backgroundColor: "#88AAF3"
        }),
    }));

    function OrderColorlibStepIcon(props: StepIconProps) {
        const {active, completed, className} = props;

        const icons: { [index: string]: React.ReactElement } = {
            1: <ShoppingCartOutlinedIcon/>,
            2: <LoopOutlinedIcon/>,
            3: <LocalShippingOutlinedIcon/>,
            4: <HailOutlinedIcon/>,
        };

        return (
            <ColorlibStepIconRoot ownerState={{completed, active}} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        );
    }

    function OrderCancelColorlibStepIcon(props: StepIconProps) {
        const {active, completed, className} = props;

        const icons: { [index: string]: React.ReactElement } = {
            1: <ShoppingCartOutlinedIcon/>,
            2: <CancelIcon/>,
        };

        return (
            <ColorlibStepIconRoot ownerState={{completed, active}} className={className}>
                {icons[String(props.icon)]}
            </ColorlibStepIconRoot>
        );
    }

    //
    // const DeliveryDateForm = () => {
    //     return (
    //         <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
    //             <Typography>Update order status to {"Delivered"}</Typography>
    //             <form onSubmit={onSubmit}>
    //                 <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
    //                     <Typography>Set Delivery Date</Typography>
    //                     <TextField {...register("deliveryDate", {required: true})} fullWidth type={"date"}
    //                                error={!!errors.deliveryDate}/>
    //                     {errors.deliveryDate &&
    //                         <span style={{color: "#EE4D2D"}}>Delivery Date is required</span>}
    //                 </Box>
    //             </form>
    //         </Box>
    //     )
    // }

    const changeOrderStatus = (newStep: OrderStatusStep) => {
        if (OrderStatus.CANCELLED != purchaseOrder.orderStatus && newStep.value != purchaseOrder.orderStatus) {
            setShowAlert(prevState1 => ({
                ...prevState1,
                open: true,
                content: newStep.value == OrderStatus.DELIVERED ? (
                    <Typography>Update order status to {newStep.label}</Typography>
                ) : (
                    <Typography>Update order status to {newStep.label}</Typography>
                ),
                handleAccept: async () => {
                    onUpdateOrderStatus(newStep.value)
                    setShowAlert(prevState2 => ({...prevState2, open: false}));
                },
                handleDenied: () => {
                    setShowAlert(prevState3 => ({...prevState3, open: false}));
                }
            }));
        }
    }

    const DisplayAlert = () => {
        if (showAlert.open) {
            return (
                <AlertDialog content={showAlert.content} isShowContent={true} isShowDeniedBtn={true}
                             isShowAcceptBtn={true}
                             deniedText={showAlert.deniedText} acceptText={showAlert.acceptText}
                             handleAccept={showAlert.handleAccept} handleDenied={showAlert.handleDenied}
                             isOpen={showAlert.open} title={showAlert.title}/>
            )
        } else {
            return null;
        }
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column"}}>
            <DisplayAlert/>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                color: "#777777",
            }}>
                <Typography fontSize={"16px"} fontWeight={"bold"}>TRACKING ORDER NO
                    - #{purchaseOrder.id}</Typography>
            </Box>
            <Box sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                p: 2,
                backgroundColor: "#F5F5F5",
                marginLeft: "-16px",
                marginRight: "-16px",
                marginBottom: "16px",
            }}>
                <Typography align={"center"}>Shipped Via: UPS Ground</Typography>
                <Typography align={"center"}>Status: Checking Quality</Typography>
                <Typography align={"center"}>Expected Date: DEC 09, 2021</Typography>
            </Box>
            {
                OrderStatus.CANCELLED != purchaseOrder.orderStatus ? (
                    <Stepper alternativeLabel activeStep={currentOrderStep} connector={<ColorlibConnector/>}>
                        {orderStatusSteps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel StepIconComponent={OrderColorlibStepIcon}
                                           onClick={() => changeOrderStatus(step)}>
                                    {step.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                ) : (
                    <Stepper alternativeLabel activeStep={currentOrderStep} connector={<ColorlibConnector/>}>
                        {orderStatusCancelSteps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel StepIconComponent={OrderCancelColorlibStepIcon}
                                           onClick={() => changeOrderStatus(step)}>
                                    {step.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                )
            }

        </Box>
    )
}

const AdminPurchaseOrderDetailPage: React.FC<Props> = () => {

    const params: RouteParams = useParams()
    const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [breadCrumbItems, setBreadCrumbItems] = useState<BreadcrumbItem[]>([]);

    /*TODO: add not found */
    useEffect(() => {
        document.title = "Admin - Order #" + params.purchaseOrderId;
        console.log(params)
        getPurchaseOrderByCriteria({purchaseOrderId: params.purchaseOrderId})
            .then((resPurchaseOrders: PurchaseOrder[]) => {
                setPurchaseOrder(resPurchaseOrders[0]);
                setBreadCrumbItems([
                    {
                        url: AdminRouter.purchaseOrderManagement,
                        title: "Order",
                    },
                    {
                        title: "Order #" + resPurchaseOrders[0].id,
                        isLasted: true
                    },
                ]);
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        }).finally(() => {
            setIsShow(true);
        })
    }, [params.purchaseOrderId]);

    const handleUpdateOrderStatus = async (newStatus: OrderStatus) => {
        updatePurchaseOrderStatus({
            purchaseOrderId: purchaseOrder.id,
            newOrderStatus: newStatus,
            deliveryDate: null
        })
            .then((res: string) => {
                console.log(res);
                getPurchaseOrderByCriteria({purchaseOrderId: params.purchaseOrderId})
                    .then((resPurchaseOrders: PurchaseOrder[]) => {
                        setPurchaseOrder(resPurchaseOrders[0]);
                    }).catch((err: ExceptionResponse) => {
                    console.log(err);
                })
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        });
    }

    if (isShow) {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Order Detail"}/>
                <Box className={"content-box"} sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}>
                    <Typography className={"page-sub-header"}>Order Detail: #{purchaseOrder.id}</Typography>
                    <Divider style={{marginLeft: "-16px", marginRight: "-16px"}}/>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <OrderInfoBlock title={"Customer:"} info={
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Typography>Full name: {purchaseOrder.customer.fullName}</Typography>
                                    <Typography>Contact
                                        email: {purchaseOrder.customer.contactEmail}</Typography>
                                    <Typography>Phone
                                        number: {purchaseOrder.customer.phoneNumber}</Typography>
                                </Box>
                            }/>
                        </Grid>
                        <Grid item xs={4}>
                            <OrderInfoBlock title={"Shipped To:"} info={purchaseOrder.customer.address}/>
                        </Grid>
                        <Grid item xs={4}>
                            <OrderInfoBlock title={"Order Date:"} info={
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Typography>Order Date: {purchaseOrder.orderDate}</Typography>
                                    <Typography>Delivery Date: {purchaseOrder.deliveryDate}</Typography>
                                    {
                                        OrderStatus.CANCELLED == purchaseOrder.orderStatus ? (
                                            <Typography>Cancel Date: {purchaseOrder.cancelDate}</Typography>
                                        ) : null
                                    }
                                    {
                                        OrderStatus.CANCELLED == purchaseOrder.orderStatus ? (
                                            <Typography>Cancel
                                                Reason: {cancelReasonOptions.find(x => x.code == purchaseOrder.cancelCode).description}</Typography>
                                        ) : null
                                    }
                                </Box>
                            }/>
                        </Grid>
                    </Grid>
                    <ProductSummary purchaseOrder={purchaseOrder}/>
                </Box>
                <Box className={"content-box"}>
                    <TrackingOrder purchaseOrder={purchaseOrder}
                                   onUpdateOrderStatus={(newStatus: OrderStatus) => handleUpdateOrderStatus((newStatus))}/>
                </Box>
            </Box>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminPurchaseOrderDetailPage;