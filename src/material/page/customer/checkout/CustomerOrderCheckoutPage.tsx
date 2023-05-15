import * as React from "react";
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {AssetPath, CustomerRouter} from "../../../config/router";
import './customerordercheckoutpage.css'
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {ProductCartGroupByEnterprise} from "../../../model/ProductCartGroupByEnterprise";
import {groupProductCartsByEnterprise} from "../../../util/cart.util";
import {Customer} from "../../../model/Customer";
import {getCurrentCustomerInfo} from "../../../service/customer.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {Link, useHistory} from "react-router-dom";
import {Alert, Chip} from "@mui/material";
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {CreateNewPurchaseOrderRequest} from "../../../model/request/CreateNewPurchaseOrderRequest";
import {createNewPurchaseOrderForCurrentCustomer} from "../../../service/order.service";
import {PAYMENT_PROCESS} from "../../../config/constants";
import {PaymentProcess} from "../../../model/enums/PaymentProcess";
import {isAuthenticated} from "../../../util/auth.util";
import {getCurrentCustomerCart} from "../../../service/cart.service";
import {Cart} from "../../../model/Cart";
import PageSpinner from "../../common/share/PageSpinner";
import AlertDialog from "../../common/share/AlertDialog";
import {EnterpriseLogo} from "../../common/share/EnterpriseLogo";
import {CartEmpty} from "../../common/share/CartEmpty";

interface Props {
    productCartGroupByEnterprises?: ProductCartGroupByEnterprise[];
    location?: any;
    history?: any;
    customer?: Customer
}

const Footer: React.FC<Props> = () => {
    return (
        <Box
            sx={{
                pl: 24,
                pt: 5,
                pb: 5,
                width: "100%",
                backgroundColor: "#EBEBF0",
                position: "fixed",
                bottom: 0,
                left: 0,
                height: "100px"
            }}>
            <Typography fontSize={11} color={"rgb(128, 128, 137)"}>Bằng việc tiến hành Đặt Mua, bạn đồng ý với các Điều
                kiện Giao dịch chung:</Typography>
            <Typography fontSize={11} mb={3}>Quy chế hoạt động | Chính sách giải quyết | khiếu nại | Chính sách bảo hành
                | Chính sách bảo mật thanh toán | Chính sách bảo mật thông tin cá nhân</Typography>
            <Typography fontSize={11} color={"rgb(128, 128, 137)"}>2019 - Bản quyền của Công Ty
                Cổ Phần Ti Ki - Tiki.vn</Typography>
        </Box>
    )
}

const ProductOrderList: React.FC<Props> = ({productCartGroupByEnterprises}) => {

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <Box sx={{backgroundColor: "#fff", borderRadius: 2}}>
                <Grid container spacing={2} p={2} alignItems={"center"} justifyContent={"space-between"}>
                    <Grid item xs={6}>
                        <Typography align={"left"}>Sản phẩm đặt</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography align={"center"}>Điểm</Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography align={"center"}>Số lượng</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align={"right"}>Tổng điểm</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: "#fff",
                borderRadius: 2,
                pt: 2
            }}>
                {
                    productCartGroupByEnterprises.map((productCartGroupByEnterprise, index1) => (
                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}} key={index1}>
                            <Box sx={{display: "flex", alignItems: "center", gap: 2, padding: "0 16px 0 16px"}}>
                                <StorefrontOutlinedIcon/>
                                <Typography>{productCartGroupByEnterprise.enterprise.enterpriseName}
                                </Typography>
                            </Box>
                            {
                                productCartGroupByEnterprise.productCarts.map((productCart, index2) => (
                                    <Grid container spacing={2} alignItems={"center"}
                                          justifyContent={"space-between"}
                                          key={index2} style={{padding: "0 16px 0 16px"}}>
                                        <Grid item xs={6}>
                                            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                                <img src={`${AssetPath.productImgUrl}${productCart.mainImgUrl}`}
                                                     alt={"img"}
                                                     style={{width: "50px", height: "50px"}}/>
                                                <Typography
                                                    className={"productName"}>{productCart.productName}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Box sx={{
                                                display: "flex",
                                                gap: 0.5,
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}>
                                                <Typography
                                                    align={"center"}>{productCart.pointSelected.pointExchange}</Typography>
                                                <EnterpriseLogo
                                                    title={productCartGroupByEnterprise.enterprise.enterpriseName}
                                                    logoUrl={productCartGroupByEnterprise.enterprise.logoUrl}
                                                    height={15} width={15}/>
                                            </Box>

                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography align={"center"}>{productCart.amountSelected}</Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Box sx={{
                                                display: "flex",
                                                gap: 0.5,
                                                alignItems: "center",
                                                justifyContent: "flex-end"
                                            }}>
                                                <Typography>{productCart.pointSelected.pointExchange * productCart.amountSelected + " "}</Typography>
                                                <EnterpriseLogo
                                                    title={productCartGroupByEnterprise.enterprise.enterpriseName}
                                                    logoUrl={productCartGroupByEnterprise.enterprise.logoUrl}
                                                    height={15} width={15}/>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                ))
                            }
                            <Divider/>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    p: 2,
                                    alignItems: "center",
                                    gap: 2,
                                    backgroundColor: "#FAFDFF",
                                    marginTop: "-16px",
                                    marginBottom: "-16px"
                                }}>
                                <Typography color={"#929292;"}>Order Total
                                    ({productCartGroupByEnterprise.productCarts.length} Item):</Typography>
                                <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                    <Typography fontWeight={"bold"} color={"#FF424E"}
                                                variant={"h6"}>{productCartGroupByEnterprise.orderTotal}</Typography>
                                    <EnterpriseLogo title={productCartGroupByEnterprise.enterprise.enterpriseName}
                                                    logoUrl={productCartGroupByEnterprise.enterprise.logoUrl}
                                                    height={20} width={20}/>
                                </Box>
                            </Box>
                            <Divider/>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    )
}

const ShippingAddress: React.FC<Props> = ({customer}) => {

    if (customer.fullName && customer.phoneNumber && customer.address) {
        return (
            <Box sx={{backgroundColor: "#fff", p: 2, borderRadius: 2, display: "flex", flexDirection: "column"}}>

                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography color={"rgb(128, 128, 137);"}>Shipping to:</Typography>
                    <Link to={CustomerRouter.dashBoardPage} target="_blank"
                          rel="noopener noreferrer">Cập nhật</Link>
                </Box>
                <Box sx={{display: "flex", gap: 1, alignItems: "center", mt: 1.5}}>
                    <Typography fontWeight={"bold"}>{customer.fullName}</Typography>
                    <Typography style={{position: "relative", top: -2}}>|</Typography>
                    <Typography fontWeight={"bold"}>{customer.phoneNumber}</Typography>
                </Box>
                <Box sx={{mt: 1}}>
                    <Typography color={"rgb(128, 128, 137);"}><Chip label="Home" size="small"
                                                                    style={{marginRight: 4}}
                                                                    color="primary"/>{customer.address}</Typography>
                </Box>
            </Box>
        )
    } else {
        return (
            <Box
                sx={{backgroundColor: "#fff", p: 2, borderRadius: 2, display: "flex", flexDirection: "column", gap: 2}}>
                <Alert severity="error">Hãy cập nhật thông tin họ tên, số điện thoại, địa chỉ liên lạc để tiến hành đặt
                    hàng</Alert>
                <Link to={CustomerRouter.dashBoardPage} target="_blank"
                      rel="noopener noreferrer" style={{marginLeft: "auto"}}>Cập nhật</Link>
            </Box>
        )
    }

}

const CheckoutTotalPoint: React.FC<Props> = ({productCartGroupByEnterprises}) => {

    return (
        <Box sx={{backgroundColor: "#fff", borderRadius: 2}}>
            {
                productCartGroupByEnterprises
                    .sort(function (a, b) {
                        return a.enterprise.id - b.enterprise.id
                    })
                    .map((productCartGroupByEnterprise, index) => (
                        <Box key={index}>
                            <Box sx={{display: "flex", flexDirection: "column", gap: 1, p: 2}}>
                                <Typography>{productCartGroupByEnterprise.enterprise.enterpriseName} {"(" + productCartGroupByEnterprise.productCarts.length + " items)"}</Typography>
                                <Divider/>
                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                    <Typography fontWeight={"bold"}>Total Payment:</Typography>
                                    <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                        <Typography fontWeight={"bold"} color={"#FF424E"}
                                                    variant={"h6"}>{productCartGroupByEnterprise.orderTotal}
                                        </Typography>
                                        <EnterpriseLogo title={productCartGroupByEnterprise.enterprise.enterpriseName}
                                                        logoUrl={productCartGroupByEnterprise.enterprise.logoUrl}
                                                        height={20} width={20}/>
                                    </Box>
                                </Box>
                            </Box>
                            <Divider/>
                        </Box>
                    ))
            }
        </Box>
    )
}

const CustomerOrderCheckoutPage: React.FC<Props> = ({location}) => {

    const [productCartGroupByEnterprises, setProductCartGroupByEnterprises] = useState<ProductCartGroupByEnterprise[]>([])
    const [currentCustomer, setCurrentCustomer] = useState<Customer>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "Bạn đã thanh toán đơn hàng thành công",
        acceptText: "Nhấn vào đây để xem lịch sử đơn hàng của bạn",
        handleAccept: null,
    });
    const history = useHistory();

    useEffect(() => {
        if (isAuthenticated()) {
            if (Array.of(PaymentProcess.OPEN_PAYMENT.toString(), PaymentProcess.DURING_PAYMENT.toString()).includes(localStorage.getItem(PAYMENT_PROCESS.toString()))) {
                getCurrentCustomerCart()
                    .then((cartRes: Cart) => {
                        if (location.state && location.state.hasOwnProperty("content")) {
                            let checkItems: [number] = location.state.content;
                            setProductCartGroupByEnterprises(groupProductCartsByEnterprise(cartRes.productCarts.filter(x => checkItems.includes(x.id))))
                            localStorage.setItem(PAYMENT_PROCESS, PaymentProcess.DURING_PAYMENT);
                        } else {
                            setProductCartGroupByEnterprises([])
                        }
                        getCurrentCustomerInfo()
                            .then((resCustomer: Customer) => {
                                setCurrentCustomer(resCustomer);
                            })
                            .catch((err: ExceptionResponse) => {
                                console.log(err);
                            });

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
            setIsShow(true)
        }

    }, [location]);

    async function placeOrder() {
        let createNewPurchaseOrderRequests: CreateNewPurchaseOrderRequest[] = [];
        productCartGroupByEnterprises.forEach(productCartGroupByEnterprise => {
            productCartGroupByEnterprise.productCarts.forEach(productCart => {
                createNewPurchaseOrderRequests.push({
                    productCartId: productCart.id
                });
            })
        });

        await createNewPurchaseOrderForCurrentCustomer(createNewPurchaseOrderRequests)
            .then((res: string) => {
                localStorage.setItem(PAYMENT_PROCESS, PaymentProcess.PAYMENT_SUCCESS);
                history.push({
                    pathname: CustomerRouter.checkoutSuccess
                });
            })
            .catch((err: ExceptionResponse) => {
                if (err.status == 409) {
                    setShowAlert(prevState1 => ({
                        ...prevState1,
                        open: true,
                        title: err.errorMessage,
                        acceptText: "OK, got it",
                        handleAccept: () => {
                            setShowAlert(prevState2 => ({...prevState2, open: false}));
                        },
                    }));
                }
                console.log(err)
            });
    }

    const DisplayAlert = () => {
        if (showAlert.open) {
            return (
                <AlertDialog
                    acceptText={showAlert.acceptText} isShowAcceptBtn={true}
                    handleAccept={showAlert.handleAccept}
                    isOpen={showAlert.open} title={showAlert.title}/>
            )
        } else {
            return null;
        }
    }

    return (
        <Box>
            <DisplayAlert/>
            {
                isShow ? (
                    <Box>
                        {
                            productCartGroupByEnterprises.length > 0 ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <ProductOrderList
                                            productCartGroupByEnterprises={productCartGroupByEnterprises}/>
                                    </Grid>
                                    <Grid item xs={4}>
                                        {
                                            currentCustomer && (
                                                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                                    <ShippingAddress customer={currentCustomer}/>
                                                    <CheckoutTotalPoint
                                                        productCartGroupByEnterprises={productCartGroupByEnterprises}/>
                                                    <Button variant={"contained"} size={"large"} fullWidth
                                                            disabled={!currentCustomer.fullName || !currentCustomer.phoneNumber || !currentCustomer.address}
                                                            style={{backgroundColor: "#FF424E"}}
                                                            onClick={() => placeOrder()}>Đặt hàng</Button>
                                                </Box>
                                            )
                                        }
                                    </Grid>
                                </Grid>
                            ) : (
                                <CartEmpty/>
                            )
                        }
                    </Box>
                ) : (
                    <PageSpinner/>
                )
            }
        </Box>
    )
}

export default CustomerOrderCheckoutPage;