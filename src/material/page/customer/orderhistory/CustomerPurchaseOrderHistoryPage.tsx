import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {CustomerPurchaseOrder} from "../../../model/customer/CustomerPurchaseOrder";
import {getAllOrderStatus, getAllPurchaseOrderForCurrentCustomer} from "../../../service/order.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {OrderStatus} from "../../../model/enums/OrderStatus";
import {InputAdornment, Rating, Tabs} from "@mui/material";
import Tab from "@mui/material/Tab";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Divider from "@mui/material/Divider";
import {AssetPath} from "../../../config/router";
import Avatar from "@mui/material/Avatar";
import PageSpinner from "../../common/share/PageSpinner";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import {TabPanel} from "../../common/share/TabPanel";
import {a11yProps} from "../../common/share/a11yProps";
import {useForm} from "react-hook-form";
import {CustomerSearchOrderCriteriaRequest} from "../../../model/request/CustomerSearchOrderCriteriaRequest";
import TextField from "@mui/material/TextField";
import SearchIcon from '@mui/icons-material/Search';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {CustomerPurchaseProduct} from "../../../model/customer/CustomerPurchaseProduct";
import {CustomerProductReviewRequest} from "../../../model/customer/CustomerProductReviewRequest";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import {PhotoCamera} from "@mui/icons-material";
import './CustomerPurchaseOrderHistoryPage.scss'
import CancelIcon from '@mui/icons-material/Cancel';
import {ErrorText} from "../../common/share/ErrorText";
import {addProductReviewByCurrentCustomer} from "../../../service/product.service";
import AlertDialog from "../../common/share/AlertDialog";

interface Props {
    children?: React.ReactNode;
    index?: number;
    value?: number;
    customerPurchaseOrders?: CustomerPurchaseOrder[],
    selectedOrder?: CustomerPurchaseOrder
}

export interface RatingOption {
    rating: number,
    description: string,
    placeholder: string
}

const ratingOptions: RatingOption[] = [
    {
        rating: 0,
        description: "Vui lòng đánh giá",
        placeholder: "Hãy chia sẽ cảm nhận, đánh giá của bạn về sản phẩm này nhé."
    },
    {
        rating: 1,
        description: "Rất không hài lòng",
        placeholder: "Hãy chia sẽ vì sao sản phẩm này không tốt nhé."
    },
    {
        rating: 2,
        description: "Không hài lòng",
        placeholder: "Hãy chia sẽ vì sao bạn không thích sản phẩm này nhé."
    },
    {
        rating: 3,
        description: "Bình thường",
        placeholder: "Hãy chia sẽ vì sao bạn chưa thực sự thích sản phẩm này nhé."
    },
    {
        rating: 4,
        description: "Hài lòng",
        placeholder: "Hãy chia sẽ vì sao bạn thích sản phẩm này nhé."
    },
    {
        rating: 5,
        description: "Rất hài lòng",
        placeholder: "Hãy chia sẽ những điều bạn thích về sản phẩm này nhé."
    },
]

const PurchaseOrderList: React.FC<Props> = ({customerPurchaseOrders}) => {

    /*TODO: move to order detail page*/
    const [selectedPurchaseProduct, setSelectedPurchaseProduct] = useState<CustomerPurchaseProduct>();
    const [openFormReview, setOpenFormReview] = useState(false);
    const {
        register,
        reset,
        setValue,
        handleSubmit,
        formState: {errors}
    } = useForm<CustomerProductReviewRequest>();
    const [ratingValue, setRatingValue] = useState<RatingOption | null>(ratingOptions[0]);
    const [reviewPlaceHolder, setReviewPlaceHolder] = useState<string>(ratingOptions.find(x => x.rating == 0).placeholder);
    const [ratingHover, setRatingHover] = useState(-1);
    const [imgUrls, setImgUrls] = useState<any[]>([]);
    const [isShowRatingError, setIsShowRatingError] = useState<boolean>(false);
    const [showAlertReview, setShowAlertReview] = useState({
        open: false,
        title: null,
        content: null,
        acceptText: null,
        handleAccept: null
    });
    /*TODO: handle cancel order*/
    const [showAlertCancel, setShowAlertCancel] = useState({
        open: false,
        title: "Hủy bỏ đơn hàng này",
        content: null,
        acceptText: null,
        handleAccept: null
    });

    const onSubmit = handleSubmit(data => {
        if (ratingValue == null || ratingValue.rating == 0) {
            setIsShowRatingError(true);
        } else {
            setIsShowRatingError(false);
            let reqImgUrls: any[] = [...imgUrls.filter(x => x != undefined)];
            let request: CustomerProductReviewRequest = {
                purchaseOrderDetailId: selectedPurchaseProduct.purchaseOrderDetailId,
                content: data.content,
                rating: ratingValue.rating,
                imgUrls: [...reqImgUrls]
            }
            addProductReviewByCurrentCustomer(request)
                .then((res: string) => {
                    setOpenFormReview(false);
                    setShowAlertReview(prevState1 => ({
                        ...prevState1,
                        open: true,
                        title: "Cảm ơn bạn đã đánh giá",
                        content: <Typography>Chúng tôi sẽ thông báo đên bạn khi đánh giá được duyệt. Đánh giá của bạn
                            giúp mọi người mua
                            sắm tốt hơn</Typography>,
                        acceptText: "OK",
                    }))
                    customerPurchaseOrders.forEach(customerPurchaseOrder => {
                        customerPurchaseOrder.purchaseProducts.find(x => x.purchaseOrderDetailId == selectedPurchaseProduct.purchaseOrderDetailId).isReview = true;
                    })
                }).catch((err: ExceptionResponse) => {
                console.log(err);
            })
        }
    });

    const handleClickOpenFormReview = () => {
        setOpenFormReview(true);
    };

    const handleCloseFormReview = () => {
        setOpenFormReview(false);
    };

    function getRatingLevelText(value: number) {
        return `${value} Star${value !== 1 ? 's' : ''}, ${ratingOptions.find(x => x.rating == value).description}`;
    }

    const handleOpenReviewForm = (purchaseProduct: CustomerPurchaseProduct) => {
        handleClickOpenFormReview();
        reset();
        setImgUrls([]);
        setRatingHover(-1);
        setRatingValue(ratingOptions[0]);
        setReviewPlaceHolder(ratingOptions[0].placeholder);
        setIsShowRatingError(false);
        setSelectedPurchaseProduct(purchaseProduct);
        setShowAlertReview(prevState1 => ({
            ...prevState1,
            open: false
        }));
    }

    const handleSetImg = (e) => {
        let newImgUrls: any[] = [...imgUrls];
        for (let i = 0; i < e.target.files.length; i++) {
            newImgUrls.push(e.target.files[i]);
        }
        console.log(newImgUrls)
        setImgUrls([...newImgUrls]);
    }

    const handleRemoveImg = (removeImg) => {
        setImgUrls([...imgUrls.filter(x => x.name != removeImg)])
    }

    const DisplayReviewAlert = () => {
        if (showAlertReview.open) {
            return (
                <AlertDialog
                    isOpen={showAlertReview.open} title={showAlertReview.title} content={showAlertReview.content}
                    isShowAcceptBtn={true}
                    isShowContent={true}
                    handleAccept={showAlertReview.handleAccept}
                    acceptText={showAlertReview.acceptText}/>
            )
        } else {
            return null;
        }
    }

    /*TODO: handle cancel*/
    if (customerPurchaseOrders.length > 0) {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <DisplayReviewAlert/>
                <form onSubmit={onSubmit} style={{width: "100%"}}>
                    <Dialog open={openFormReview} onClose={handleCloseFormReview}>
                        <DialogTitle sx={{m: 0, p: 2}}>
                            {
                                selectedPurchaseProduct && (
                                    <Box sx={{display: "flex", gap: 2, width: "70%"}}>

                                        <img src={`${AssetPath.productImgUrl}${selectedPurchaseProduct.mainImgUrl}`}
                                             alt={"img"}
                                             style={{
                                                 width: "60px",
                                                 height: "60px",
                                                 display: "block",
                                             }}/>
                                        <Box sx={{display: "flex", gap: 0.5, flexDirection: "column"}}>
                                            <Typography fontSize={"14px"}>{selectedPurchaseProduct.productName}</Typography>
                                        </Box>
                                    </Box>
                                )
                            }
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseFormReview}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </DialogTitle>
                        <DialogContent sx={{p: "16px"}}>
                            <DialogContentText>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    gap: 1,
                                    mb: 3
                                }}>
                                    {ratingValue !== null && (
                                        <Box sx={{
                                            fontSize: "16px",
                                            fontWeight: "bold"
                                        }}>{ratingOptions.find(x => x.rating == (ratingHover !== -1 ? ratingHover : ratingValue.rating)).description}</Box>
                                    )}
                                    <Rating
                                        name="hover-feedback"
                                        value={ratingValue.rating}
                                        precision={1}
                                        style={{fontSize: "40px"}}
                                        getLabelText={getRatingLevelText}
                                        onChange={(event, newValue) => {
                                            let newRating: RatingOption = ratingOptions.find(x => x.rating == newValue)
                                            setRatingValue(newRating);
                                            setReviewPlaceHolder(newRating.placeholder);
                                        }}
                                        onChangeActive={(event, newHover) => {
                                            setRatingHover(newHover);
                                            if (ratingValue !== null) {
                                                setReviewPlaceHolder(ratingOptions.find(x => x.rating == (ratingHover !== -1 ? ratingHover : ratingValue.rating)).placeholder);
                                            }
                                        }}
                                        emptyIcon={<StarIcon style={{opacity: 0.55, fontSize: "40px"}}
                                                             fontSize="inherit"/>}
                                    />
                                    {
                                        isShowRatingError && (
                                            <ErrorText text={"Bạn cần đánh giá trước khi gửi."} style={{fontSize: "12px"}}/>
                                        )
                                    }
                                </Box>
                            </DialogContentText>
                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                <TextField {...register("content")} fullWidth multiline
                                           placeholder={reviewPlaceHolder}
                                           rows={8}/>
                                <Box sx={{display: "flex", gap: 2}}>
                                    {
                                        imgUrls.filter(x => x != undefined).map((imgUrl, index) => (
                                            <Box sx={{position: "relative"}} className={"img-upload-block"}>
                                                <img
                                                    src={URL.createObjectURL(imgUrl)}
                                                    alt={"img"}
                                                    className={"upload-img"}
                                                    style={{width: 50, height: 50, borderRadius: 2}}/>
                                                <IconButton color="primary"
                                                            style={{
                                                                position: "absolute",
                                                                left: 1,
                                                                top: -5,
                                                                color: "white"
                                                            }}
                                                            className={"cancel-btn"}
                                                            disableRipple={true}
                                                            size={"large"} aria-label="upload picture"
                                                            onClick={() => handleRemoveImg(imgUrl.name)}
                                                            component="label">
                                                    <CancelIcon/>
                                                </IconButton>
                                            </Box>
                                        ))
                                    }
                                </Box>
                                <Box sx={{display: "flex", justifyContent: "space-between", gap: 2}}>
                                    <Button variant={"outlined"} startIcon={<PhotoCamera/>} component="label"
                                            style={{width: "50%"}}>Thêm ảnh
                                        <input hidden accept="image/*" type="file" multiple
                                               onChange={handleSetImg}/>
                                    </Button>
                                    <Button variant={"contained"} type={"submit"} onClick={onSubmit}
                                            style={{width: "50%"}}>Gửi đánh giá</Button>
                                </Box>
                            </Box>
                        </DialogContent>
                    </Dialog>
                </form>
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
                            <Box sx={{display: "flex", alignItems: "center", gap: 1, color: "var(--polargreen-700)"}}>
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
                                                         height: "80px",
                                                         display: "block",
                                                     }}/>
                                                <Box sx={{display: "flex", gap: 1, flexDirection: "column"}}>
                                                    <Typography>{purchaseProduct.productName}</Typography>
                                                    <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                                        <Typography>x{purchaseProduct.amount}</Typography>
                                                        {
                                                            customerPurchaseOrder.orderStatus == OrderStatus.DELIVERED && !purchaseProduct.isReview && (
                                                                <Button variant={"outlined"}
                                                                        onClick={() => handleOpenReviewForm(purchaseProduct)}
                                                                        style={{textTransform: "initial"}}
                                                                        size={"small"}>Review</Button>
                                                            )
                                                        }
                                                    </Box>
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
                                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                    {
                                        customerPurchaseOrder.orderStatus == OrderStatus.OPEN && (
                                            <Button variant={"outlined"} color={"error"}
                                                    sx={{textTransform: "none"}}>Hủy đơn hàng</Button>
                                        )
                                    }
                                    <Link to={"/"}><Button variant={"outlined"} sx={{textTransform: "none"}}>Xem chi
                                        tiết</Button></Link>
                                </Box>
                            </Box>
                        </Box>
                    ))
                }
            </Box>
        )
    } else {
        return (
            <Box sx={{
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 2,
                height: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
            }}>
                <img src={AssetPath.emptyOrderImg} alt={"cart-empty"} width={"200px"}/>
                <Typography fontSize={16}>Chưa có đơn hàng</Typography>
            </Box>
        )
    }

}

const CustomerPurchaseOrderHistoryPage: React.FC<Props> = () => {

    const [customerPurchaseOrders, setCustomerPurchaseOrders] = useState<CustomerPurchaseOrder[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);

    const [orderStatusTab, setOrderStatusTab] = useState<number>(0);
    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm<CustomerSearchOrderCriteriaRequest>();

    useEffect(() => {
        getAllPurchaseOrderForCurrentCustomer()
            .then((resCustomerPurchaseOrders: CustomerPurchaseOrder[]) => {
                setCustomerPurchaseOrders(resCustomerPurchaseOrders);
                getAllOrderStatus()
                    .then((resOrderStatusList: OrderStatus[]) => {
                    })
                    .catch((err: ExceptionResponse) => {
                        console.log(err);
                    }).finally(() => {
                    setIsShow(true)
                })
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }, []);

    const handleChangeOrderStatusTab = (event: React.SyntheticEvent, newOrderStatusTabValue: number) => {
        setOrderStatusTab(newOrderStatusTabValue);
    };

    /*TODO: handle search order*/
    const onSubmit = handleSubmit(data => {

    });

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <Typography variant={"h6"}>Đơn hàng của tôi</Typography>
            <Box
                sx={{backgroundColor: "#fff", borderRadius: 2}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={orderStatusTab} onChange={handleChangeOrderStatusTab}

                          aria-label="basic tabs example">
                        <Tab label="Tất cả" {...a11yProps(0)} style={{textTransform: "initial"}}/>
                        <Tab label="Đã đặt hàng" {...a11yProps(1)} style={{textTransform: "initial"}}/>
                        <Tab label="Đang xử lý" {...a11yProps(2)} style={{textTransform: "initial"}}/>
                        <Tab label="Vận chuyển" {...a11yProps(3)} style={{textTransform: "initial"}}/>
                        <Tab label="Đã giao" {...a11yProps(4)} style={{textTransform: "initial"}}/>
                        <Tab label="Đã hủy" {...a11yProps(5)} style={{textTransform: "initial"}}/>
                    </Tabs>
                </Box>
            </Box>
            <Box>

            </Box>
            <Box sx={{backgroundColor: "#fff", mt: -2, mb: 0}}>
                <form onSubmit={onSubmit}>
                    <Box sx={{display: "flex", alignItems: "flex-start"}}>
                        <TextField {...register("keyword",)} style={{width: "85%"}}
                                   size={"small"}
                                   placeholder={"Tìm kiếm theo mã đơn hành, nhà cung cấp hoặc tên sản phẩm"}
                                   InputProps={{
                                       startAdornment: (
                                           <InputAdornment position="start">
                                               <SearchIcon/>
                                           </InputAdornment>
                                       ),
                                   }}/>
                        <Button type={"button"} variant={"outlined"} sx={{width: "15%", textTransform: "initial"}}>Tìm
                            đơn hàng</Button>
                    </Box>
                </form>
            </Box>
            {
                isShow ? (
                    <Box>
                        <TabPanel value={orderStatusTab} index={0}>
                            <PurchaseOrderList customerPurchaseOrders={customerPurchaseOrders}/>
                        </TabPanel>
                        <TabPanel value={orderStatusTab} index={1}>
                            <PurchaseOrderList
                                customerPurchaseOrders={customerPurchaseOrders.filter(x => x.orderStatus == OrderStatus.OPEN)}/>
                        </TabPanel>
                        <TabPanel value={orderStatusTab} index={2}>
                            <PurchaseOrderList
                                customerPurchaseOrders={customerPurchaseOrders.filter(x => x.orderStatus == OrderStatus.PROCESSING)}/>
                        </TabPanel>
                        <TabPanel value={orderStatusTab} index={3}>
                            <PurchaseOrderList
                                customerPurchaseOrders={customerPurchaseOrders.filter(x => x.orderStatus == OrderStatus.IN_TRANSIT)}/>
                        </TabPanel>
                        <TabPanel value={orderStatusTab} index={4}>
                            <PurchaseOrderList
                                customerPurchaseOrders={customerPurchaseOrders.filter(x => x.orderStatus == OrderStatus.DELIVERED)}/>
                        </TabPanel>
                        <TabPanel value={orderStatusTab} index={5}>
                            <PurchaseOrderList
                                customerPurchaseOrders={customerPurchaseOrders.filter(x => x.orderStatus == OrderStatus.CANCELLED)}/>
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