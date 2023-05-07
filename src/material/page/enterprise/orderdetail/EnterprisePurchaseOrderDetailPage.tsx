import {EnterprisePurchaseOrder} from "../../../model/enterprise/EnterprisePurchaseOrder";
import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Step, StepConnector, stepConnectorClasses, StepIconProps, StepLabel, Stepper} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {AssetPath, EnterpriseRouter} from "../../../config/router";
import PageSpinner from "../../common/share/PageSpinner";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {
    getPurchaseOrderDetailForCurrentEnterprise,
    updatePurchaseOrderStatusForCurrentEnterprise
} from "../../../service/order.service";
import Divider from "@mui/material/Divider";
import {styled} from '@mui/material/styles';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import HailOutlinedIcon from '@mui/icons-material/HailOutlined';
import {OrderStatus} from "../../../model/enums/OrderStatus";
import AlertDialog from "../../common/share/AlertDialog";
import {Enterprise} from "../../../model/Enterprise";
import {getCurrentEnterpriseInfo} from "../../../service/enterprise.service";
import Avatar from "@mui/material/Avatar";
import {formatVndMoney} from "../../../util/url.util";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import AdminPageHeader from "../../common/admin/AdminPageHeader";

interface RouteParams {
    purchaseOrderId: any;
}

interface OrderStatusStep {
    label: string,
    value: OrderStatus
}

interface Props {
    enterprisePurchaseOrder?: EnterprisePurchaseOrder,
    currentEnterprise?: Enterprise,
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

const ProductSummary: React.FC<Props> = ({enterprisePurchaseOrder, currentEnterprise}) => {


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
                enterprisePurchaseOrder.purchaseProducts.map((purchaseProduct, index) => {

                    return (
                        <Box sx={{backgroundColor: index % 2 == 0 ? "#F9F9F9" : "#fff"}}>
                            <Grid container spacing={2} p={1} alignItems={"center"} justifyContent={"space-between"}>
                                <Grid item xs={2}>
                                    <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                        <Box sx={{width: "30%"}}>
                                            <Typography>{index}</Typography>
                                        </Box>
                                        <Box sx={{width: "70%"}}>
                                            <img src={`${AssetPath.productImgUrl}${purchaseProduct.mainImgUrl}`}
                                                 alt={"img"}
                                                 style={{
                                                     width: "50px",
                                                     display: "block"
                                                 }}/>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Link style={{width: "100%"}} to={"/"}
                                          className={"productName"}>{purchaseProduct.productName}</Link>
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
                                                src={AssetPath.enterpriseLogoUrl + currentEnterprise.logoUrl}
                                                sx={{width: 20, height: 20}}/>
                                    </Box>
                                </Grid>
                                <Grid item xs={1}>
                                    <Typography
                                        align={"center"}>{formatVndMoney(purchaseProduct.initialCash)}</Typography>
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
                                                src={AssetPath.enterpriseLogoUrl + currentEnterprise.logoUrl}
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
                style={{backgroundColor: enterprisePurchaseOrder.purchaseProducts.length % 2 == 0 ? "#F9F9F9" : "#fff"}}>
                <Grid container spacing={2} p={1} alignItems={"center"}>
                    <Grid item xs={10}>
                        <Typography align={"right"} fontWeight={"bold"}>Total point:</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Box sx={{display: "flex", gap: 0.5, alignItems: "center", justifyContent: "flex-end"}}>
                            <Typography align={"right"}
                                        fontWeight={"bold"}>{enterprisePurchaseOrder.orderTotalPointExchange}</Typography>
                            <Avatar alt="img"
                                    src={AssetPath.enterpriseLogoUrl + currentEnterprise.logoUrl}
                                    sx={{width: 20, height: 20}}/>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box
                style={{backgroundColor: enterprisePurchaseOrder.purchaseProducts.length % 2 != 0 ? "#F9F9F9" : "#fff"}}>
                <Grid container spacing={2} p={1} alignItems={"center"}>
                    <Grid item xs={10}>
                        <Typography align={"right"} fontWeight={"bold"}>To cash (VND):</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align={"right"}
                                    fontWeight={"bold"}>{formatVndMoney(enterprisePurchaseOrder.orderTotalCash)}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box
                style={{backgroundColor: enterprisePurchaseOrder.purchaseProducts.length % 2 == 0 ? "#F9F9F9" : "#fff"}}>
                <Grid container spacing={2} p={1} alignItems={"center"} justifyContent={"flex-end"}>
                    <Grid item xs={10}>
                        <Typography align={"right"} fontWeight={"bold"}>Order Status:</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align={"right"}
                                    fontWeight={"bold"}>{enterprisePurchaseOrder.orderStatusDescription}</Typography>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    )
}

const TrackingOrder: React.FC<Props> = ({enterprisePurchaseOrder, onUpdateOrderStatus}) => {

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
        switch (enterprisePurchaseOrder.orderStatus) {
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
        }
    }, [enterprisePurchaseOrder])

    const steps: OrderStatusStep[] = [
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

    function ColorlibStepIcon(props: StepIconProps) {
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
        if (newStep.value != enterprisePurchaseOrder.orderStatus) {
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
                    - #{enterprisePurchaseOrder.id}</Typography>
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
            <Stepper alternativeLabel activeStep={currentOrderStep} connector={<ColorlibConnector/>}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepLabel StepIconComponent={ColorlibStepIcon} onClick={() => changeOrderStatus(step)}>
                            {step.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    )
}

const EnterprisePurchaseOrderDetailPage: React.FC<Props> = () => {

    const params: RouteParams = useParams()
    const [enterprisePurchaseOrder, setEnterprisePurchaseOrder] = useState<EnterprisePurchaseOrder>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [currentEnterprise, setCurrentEnterprise] = useState<Enterprise>(null);
    const [breadCrumbItems, setBreadCrumbItems] = useState<BreadcrumbItem[]>([]);

    /*TODO: add not found */
    useEffect(() => {
        getPurchaseOrderDetailForCurrentEnterprise(params.purchaseOrderId)
            .then((resEnterprisePurchaseOrder: EnterprisePurchaseOrder) => {
                setEnterprisePurchaseOrder(resEnterprisePurchaseOrder);
                getCurrentEnterpriseInfo()
                    .then((resEnterprise: Enterprise) => {
                        setCurrentEnterprise(resEnterprise);
                        setBreadCrumbItems([
                            {
                                url: EnterpriseRouter.purchaseOrderManagement,
                                title: "Order",
                            },
                            {
                                title: "Order #" + resEnterprisePurchaseOrder.id,
                                isLasted: true
                            },
                        ]);
                    }).catch((err: ExceptionResponse) => {
                    console.log(err);
                });
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        }).finally(() => {
            setIsShow(true);
        })
    }, [params.purchaseOrderId]);

    const handleUpdateOrderStatus = async (newStatus: OrderStatus) => {
        updatePurchaseOrderStatusForCurrentEnterprise({
            purchaseOrderId: enterprisePurchaseOrder.id,
            newOrderStatus: newStatus,
            deliveryDate: null
        })
            .then((res: string) => {
                console.log(res);
                getPurchaseOrderDetailForCurrentEnterprise(enterprisePurchaseOrder.id)
                    .then((resEnterprisePurchaseOrder: EnterprisePurchaseOrder) => {
                        console.log(resEnterprisePurchaseOrder)
                        setEnterprisePurchaseOrder(resEnterprisePurchaseOrder);
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
                <AdminPageHeader breadCrumbItems={breadCrumbItems} title={"Order Detail"}/>
                <Box className={"content-box"} sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}>
                    <Typography className={"page-sub-header"}>Order Detail: #{enterprisePurchaseOrder.id}</Typography>
                    <Divider style={{marginLeft: "-16px", marginRight: "-16px"}}/>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <OrderInfoBlock title={"Customer:"} info={
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Typography>Full name: {enterprisePurchaseOrder.customerFullName}</Typography>
                                    <Typography>Contact
                                        email: {enterprisePurchaseOrder.customerContactEmail}</Typography>
                                    <Typography>Phone
                                        number: {enterprisePurchaseOrder.customer.phoneNumber}</Typography>
                                </Box>
                            }/>
                        </Grid>
                        <Grid item xs={4}>
                            <OrderInfoBlock title={"Shipped To:"} info={enterprisePurchaseOrder.customer.address}/>
                        </Grid>
                        <Grid item xs={4}>
                            <OrderInfoBlock title={"Order Date:"} info={
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Typography>Order Date: {enterprisePurchaseOrder.orderDate}</Typography>
                                    <Typography>Delivery Date: {enterprisePurchaseOrder.deliveryDate}</Typography>
                                </Box>
                            }/>
                        </Grid>
                    </Grid>
                    {
                        currentEnterprise && (
                            <ProductSummary enterprisePurchaseOrder={enterprisePurchaseOrder}
                                            currentEnterprise={currentEnterprise}/>
                        )
                    }
                </Box>
                <Box className={"content-box"}>
                    <TrackingOrder enterprisePurchaseOrder={enterprisePurchaseOrder}
                                   onUpdateOrderStatus={(newStatus: OrderStatus) => handleUpdateOrderStatus((newStatus))}/>
                </Box>
            </Box>
        )
    } else {
        return <PageSpinner/>
    }
}

export default EnterprisePurchaseOrderDetailPage;