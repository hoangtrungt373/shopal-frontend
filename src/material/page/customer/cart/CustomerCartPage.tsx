import * as React from 'react';
import {useEffect, useState} from 'react';
import {Cart} from "../../../model/Cart";
import {Link, useHistory} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {AssetPath, CustomerRouter} from "../../../config/router";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {ButtonGroup, Chip, Divider, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import './CustomerCartPage.scss'
import Grid from "@mui/material/Grid";
import {createSeoLink} from '../../../util/display.util';
import {UpdateProductCartRequest} from "../../../model/request/UpdateProductCartRequest";
import {getCurrentCustomerCart, updateProductCartsForCurrentCustomer} from "../../../service/cart.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import {ProductCartGroupByEnterprise} from "../../../model/ProductCartGroupByEnterprise";
import Avatar from "@mui/material/Avatar";
import {groupProductCartsByEnterprise} from "../../../util/cart.util";
import {isAuthenticated} from "../../../util/auth.util";
import PageSpinner from "../../common/share/PageSpinner";
import AlertDialog from "../../common/share/AlertDialog";
import {ProductCart} from "../../../model/ProductCart";
import {EnterpriseLogo} from "../../common/share/EnterpriseLogo";
import {CartEmpty} from '../../common/share/CartEmpty';
import {EnterpriseMembership} from "../../../model/customer/EnterpriseMembership";
import {getEnterpriseMembershipForCurrentCustomer} from "../../../service/membership.service";
import {PAYMENT_PROCESS} from "../../../config/constants";
import {PaymentProcess} from "../../../model/enums/PaymentProcess";
import {isNotNull} from "../../../util/object.util";
import {ProductStatus} from "../../../model/enums/ProductStatus";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";

interface Props {
    productCarts?: ProductCart[]
    onUpdateProductCart?: Function;
    onToggleCheckAllProductCart?: Function;
    onRemoveProductCartMany?: Function;
    productCartGroupByEnterprises?: ProductCartGroupByEnterprise[],
    isShowActive?: boolean
}


const ProductCartList: React.FC<Props> = ({
                                              isShowActive,
                                              productCarts,
                                              onUpdateProductCart,
                                              onToggleCheckAllProductCart,
                                              onRemoveProductCartMany
                                          }) => {

    const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
    const [isCheck, setIsCheck] = useState([]);

    const handleCheckAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(productCarts.map(x => x.id.toString()));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    useEffect(() => {
        if (isShowActive) {
            setIsCheckAll(isCheck.length == productCarts.length);
        }
    }, [isCheck]);

    useEffect(() => {
        if (isShowActive) {
            if (isCheckAll && isCheck.length <= productCarts.length) {
                onToggleCheckAllProductCart(true);
            } else if (!isCheckAll && isCheck.length == 0) {
                onToggleCheckAllProductCart(false);
            }
        }
    }, [isCheckAll])

    const handleCheck = e => {
        if (isShowActive) {
            const {id, checked} = e.target;
            setIsCheck([...isCheck, id]);
            if (!checked) {
                setIsCheck(isCheck.filter(x => x !== id));
            }
        }
    };

    function isDuplicatePointSelected(exchangeAbleProductPointId, productCartId) {
        return productCarts.findIndex(x => x.pointSelected.id == exchangeAbleProductPointId && x.id != productCartId) != -1;
    }

    const validateAmountSelect = (selectProductCart: ProductCart, newAmount: number, productQuantityInStock) => {
        let totalAmount: number = productCarts.filter(x => x.productId == selectProductCart.productId && x.id != selectProductCart.id).map(x => x.amountSelected).reduce((a, b) => a + b, 0);
        totalAmount += newAmount;
        return totalAmount <= productQuantityInStock;
    }

    /*TODO: show inactive product*/
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <Box sx={{backgroundColor: "#fff", borderRadius: 2}}>
                {
                    isShowActive ? (
                        <Grid container spacing={2} p={1.5} alignItems={"center"} justifyContent={"space-between"}>
                            <Grid item xs={5}>
                                <Box style={{display: "flex", alignItems: "center"}}>
                                    <Checkbox className={"rowCheckbox"} disableRipple checked={isCheckAll}
                                              onClick={() => {
                                                  handleCheckAll();
                                              }}/>
                                    <Typography align={"left"} marginLeft={"12px"}>Chọn tất cả
                                        ({productCarts.length} sản phẩm)</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography align={"center"}>Nhà cung cấp</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Typography align={"center"} style={{position: "relative", left: 3}}>Điểm</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography align={"center"}>Số lượng</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Box style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                    <Typography align={"center"}>Số tiền</Typography>
                                    <DeleteOutlineOutlinedIcon className={"delete-svg"}
                                                               onClick={() => onRemoveProductCartMany()}/>
                                </Box>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={2} p={1.5} alignItems={"center"} justifyContent={"space-between"}>
                            <Grid item xs={12}>
                                <Box style={{display: "flex", alignItems: "center"}}>
                                    <Typography align={"left"} marginLeft={"56px"}>Danh sách sản phẩm không hoạt
                                        động</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    )
                }
            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: '#fff',
                borderRadius: 2
            }}>
                {
                    productCarts.map((productCart, index) => (
                        <Box key={index}>
                            <Grid container spacing={2} p={1.5} alignItems={"center"} justifyContent={"space-between"}>
                                <Grid item xs={5}>
                                    <Box style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                        {
                                            isShowActive ? (
                                                <Checkbox className={"rowCheckbox"} disableRipple
                                                          id={productCart.id.toString()}
                                                          checked={isCheck.includes(productCart.id.toString())}
                                                          onClick={(event) => {
                                                              handleCheck(event);
                                                              onUpdateProductCart(productCart.id, productCart.pointSelected.id, productCart.amountSelected, !productCart.checked);
                                                          }}/>
                                            ) : (
                                                <Box>
                                                    {
                                                        productCart.productStatus == ProductStatus.INACTIVE ? (
                                                            <Chip label={productCart.productStatus} size={"small"}/>
                                                        ) : (
                                                            <Chip label={"Hết hiệu lực"} size={"small"}/>
                                                        )
                                                    }
                                                </Box>
                                            )
                                        }
                                        <img src={`${AssetPath.productImgUrl}${productCart.mainImgUrl}`} alt={"img"}
                                             style={{
                                                 width: "80px",
                                                 display: "block",
                                                 marginLeft: "12px",
                                                 marginRight: "16px",
                                                 opacity: isShowActive ? 1 : "0.3"
                                             }}/>
                                        <Link className={"product-cart-name"}
                                              style={{width: "100%", opacity: isShowActive ? 1 : "0.3"}} target="_blank"
                                              rel="noopener noreferrer"
                                              to={CustomerRouter.productDetailPage + "/" + createSeoLink(productCart.productName) + "." + productCart.productId}
                                        >{productCart.productName}</Link>
                                    </Box>
                                </Grid>
                                <Grid item xs={2}>
                                    <FormControl style={{width: "100%", opacity: isShowActive ? 1 : "0.3"}}>
                                        <InputLabel>Point select</InputLabel>
                                        <Select
                                            value={productCart.pointSelected.id}
                                            label="Point select"
                                            size="small"
                                            style={{pointerEvents: isShowActive ? "auto" : "none"}}
                                            onChange={(event) => onUpdateProductCart(productCart.id, event.target.value, productCart.amountSelected)}
                                        >
                                            {
                                                productCart.exchangeAblePoints.map((point, index) => (
                                                    <MenuItem value={point.id}
                                                              className={isDuplicatePointSelected(point.id, productCart.id) ? "disable-item" : ""}
                                                              key={index}>{point.enterprise.enterpriseName}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1}>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 0.5,
                                        alignItems: "center",
                                        position: "relative",
                                        left: 12,
                                        opacity: isShowActive ? 1 : "0.3"
                                    }}>
                                        <Typography>{productCart.pointSelected.pointExchange}</Typography>
                                        <EnterpriseLogo title={productCart.pointSelected.enterprise.enterpriseName}
                                                        logoUrl={productCart.pointSelected.enterprise.logoUrl}
                                                        height={15} width={15}/>
                                    </Box>
                                </Grid>
                                <Grid item xs={2}>
                                    <ButtonGroup variant="outlined" aria-label="outlined primary button group"
                                                 className={"amount-btn-group"}
                                                 style={{
                                                     display: "flex",
                                                     justifyContent: "center",
                                                     position: "relative",
                                                     pointerEvents: isShowActive ? "auto" : "none",
                                                     opacity: isShowActive ? 1 : "0.3"
                                                 }}>
                                        <button className={"amount-btn"} type={"button"}
                                                style={{borderTopLeftRadius: "2px", borderBottomLeftRadius: "2px"}}
                                                onClick={() => {
                                                    if (productCart.amountSelected - 1 > 0 && validateAmountSelect(productCart, productCart.amountSelected - 1, productCart.quantityInStock)) {
                                                        onUpdateProductCart(productCart.id, productCart.pointSelected.id, productCart.amountSelected - 1);
                                                    }
                                                }}>-
                                        </button>
                                        {/* TODO: handle 0 amount */}
                                        {/* TODO: do not allow user input str */}
                                        <input id={"amount"} value={productCart.amountSelected}
                                               className={"amount-input"}
                                               onChange={event => {
                                                   let newAmount = parseInt(event.target.value);
                                                   if (Number.isNaN(newAmount) && validateAmountSelect(productCart, newAmount, productCart.quantityInStock)) {
                                                       onUpdateProductCart(productCart.id, productCart.pointSelected.id, null);
                                                   } else if (newAmount > 0 && validateAmountSelect(productCart, newAmount, productCart.quantityInStock)) {
                                                       onUpdateProductCart(productCart.id, productCart.pointSelected.id, newAmount);
                                                   }
                                               }}
                                               onBlur={() => {
                                                   if (productCart.amountSelected == null) {
                                                       onUpdateProductCart(productCart.id, productCart.pointSelected.id, 1);
                                                   }
                                               }}></input>
                                        <button className={"amount-btn"} type={"button"}
                                                style={{borderTopRightRadius: "2px", borderBottomRightRadius: "2px"}}
                                                onClick={() => {
                                                    if (validateAmountSelect(productCart, productCart.amountSelected + 1, productCart.quantityInStock)) {
                                                        onUpdateProductCart(productCart.id, productCart.pointSelected.id, productCart.amountSelected + 1)
                                                    }
                                                }}>+
                                        </button>
                                        {
                                            productCart.quantityInStock < 10 && (
                                                <Typography style={{
                                                    position: "absolute",
                                                    left: 8,
                                                    top: "100%",
                                                    fontSize: "12px",
                                                    color: "var(--red-600)"
                                                }}>Chỉ
                                                    còn {productCart.quantityInStock} sp</Typography>
                                            )
                                        }
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={2}>
                                    <Box style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}>
                                        <Box sx={{
                                            display: "flex",
                                            gap: 0.5,
                                            alignItems: "center",
                                            position: "relative",
                                            right: 10
                                        }}>
                                            <Typography fontWeight={"bold"} ml={2.3} align={"center"}
                                                        style={{opacity: isShowActive ? 1 : "0.3"}}
                                                        color={"#EE4D2D"}>{productCart.pointSelected.pointExchange * productCart.amountSelected + " "}
                                            </Typography>
                                            <EnterpriseLogo title={productCart.pointSelected.enterprise.enterpriseName}
                                                            logoUrl={productCart.pointSelected.enterprise.logoUrl}
                                                            style={{opacity: isShowActive ? 1 : "0.3"}}
                                                            height={15} width={15}/>
                                        </Box>
                                        <DeleteOutlineOutlinedIcon className={"delete-svg"}
                                                                   onClick={() => onUpdateProductCart(productCart.id, productCart.pointSelected.id, 0)}/>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider/>
                        </Box>
                    ))
                }
            </Box>
        </Box>
    );
}

const OrderPointTotal: React.FC<Props> = ({productCartGroupByEnterprises}) => {

    if (productCartGroupByEnterprises.length > 0) {
        return (
            <Box sx={{backgroundColor: "#fff", borderRadius: 2}}>
                {
                    productCartGroupByEnterprises
                        .sort(function (a, b) {
                            return a.enterprise.id - b.enterprise.id
                        })
                        .map((productCartGroupByEnterprise, index) => (
                            <Box key={index}>
                                <Box sx={{display: "flex", flexDirection: "column", gap: 2, p: 2}}>
                                    <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                        <Avatar alt="img"
                                                src={AssetPath.enterpriseLogoUrl + productCartGroupByEnterprise.enterprise.logoUrl}
                                                sx={{width: 50, height: 50}}/>
                                        <Box sx={{display: "flex", flexDirection: "column"}}>
                                            <Typography>{productCartGroupByEnterprise.enterprise.enterpriseName}</Typography>
                                            <Typography> {"(" + productCartGroupByEnterprise.amountTotal + " items)"}</Typography>
                                        </Box>
                                    </Box>
                                    <Divider/>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography>Merchandise Subtotal:</Typography>
                                        <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                            <Typography>{productCartGroupByEnterprise.orderTotal + " "}</Typography>
                                            <EnterpriseLogo
                                                title={productCartGroupByEnterprise.enterprise.enterpriseName}
                                                logoUrl={productCartGroupByEnterprise.enterprise.logoUrl}
                                                height={20} width={20}/>
                                        </Box>
                                    </Box>
                                    <Divider/>
                                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                        <Typography fontWeight={"bold"}>Total Payment:</Typography>
                                        <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                            <Typography fontWeight={"bold"} color={"#FF424E"}
                                                        variant={"h6"}>{productCartGroupByEnterprise.orderTotal}</Typography>
                                            <EnterpriseLogo
                                                title={productCartGroupByEnterprise.enterprise.enterpriseName}
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
        );
    } else {
        return (
            <Box sx={{backgroundColor: "#fff", p: 2, borderRadius: 2}}>
                <Typography>Hãy chọn sản phẩm bạn muốn mua</Typography>
            </Box>
        )
    }
}

const CustomerCartPage: React.FC<Props> = ({}) => {


    const [activeProductCarts, setActiveProductCarts] = useState<ProductCart[]>([]);
    const [nonActiveProductCarts, setNonActiveProductCarts] = useState<ProductCart[]>([])
    const [enterpriseMemberships, setEnterpriseMemberships] = useState<EnterpriseMembership[]>([]);
    const [totalItem, setTotalItem] = useState<number>(0);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [showAlertDelete, setShowAlertDelete] = useState({
        open: false,
        title: "Xóa sản phẩm này khỏi giỏ hàng?",
        content: <Typography>Are you sure want to remove selected products?</Typography>,
        acceptText: "Xóa",
        deniedText: "Để sau",
        handleDenied: null,
        handleAccept: null
    });
    const [showAlertError, setShowAlertError] = useState({
        open: false,
        title: "Bạn vẫn chưa chọn sản phẩm nào để đặt hagnf",
        acceptText: "Ok, got it",
        handleAccept: () => {
            setShowAlertError(prevState2 => ({
                ...prevState2,
                open: false
            }));
        },
        handleDenied: () => {
            setShowAlertError(prevState2 => ({
                ...prevState2,
                open: false
            }));
        }
    });
    const history = useHistory();

    const getActiveProductCart = (cart: Cart) => {
        console.log(cart)
        return cart.productCarts.filter(x => x.pointSelected.active && x.productStatus == ProductStatus.ACTIVE);
    }

    const getNonActiveProductCart = (cart: Cart) => {
        return cart.productCarts.filter(x => !x.pointSelected.active || x.productStatus == ProductStatus.INACTIVE);
    }

    const toggleCheckAllProductCart = (checked: boolean) => {
        let updateProductCarts: ProductCart[] = [...activeProductCarts];
        updateProductCarts.forEach(productCart => productCart.checked = checked);
        setActiveProductCarts([...updateProductCarts]);
    }

    useEffect(() => {
        let newTotalItem = 0
        activeProductCarts.filter(x => x.checked).map(x => x.amountSelected).forEach((amount, index) => {
            newTotalItem += amount;
        });
        setTotalItem(newTotalItem);
    }, [activeProductCarts]);

    const updateProductCart = (productCartId: number, newProductPointId: number, newAmount: number, checked: boolean) => {
        if (activeProductCarts.length > 0 || nonActiveProductCarts.length > 0) {
            if (newAmount == 0) {
                // case delete
                setShowAlertDelete(prevState1 => ({
                    ...prevState1,
                    open: true,
                    handleAccept: async () => {
                        console.log("accept")
                        setShowAlertDelete(prevState2 => ({...prevState2, open: false}));
                        updateProductCartsForCurrentCustomer([{
                            productCartId: productCartId,
                            productPointId: newProductPointId,
                            amount: newAmount
                        }])
                            .then((res: string) => {
                                getCurrentCustomerCart()
                                    .then((cartRes: Cart) => {
                                        setActiveProductCarts([...getActiveProductCart(cartRes)]);
                                        setNonActiveProductCarts([...getNonActiveProductCart(cartRes)]);
                                    })
                                    .catch((err: ExceptionResponse) => {
                                        console.log(err);
                                    });
                            })
                            .catch((err: ExceptionResponse) => {
                                console.log(err)
                            });
                    },
                    handleDenied: () => {
                        setShowAlertDelete(prevState3 => ({...prevState3, open: false}));
                    }
                }));
            } else {
                // case update amount

                updateProductCartsForCurrentCustomer([{
                    productCartId: productCartId,
                    productPointId: newProductPointId,
                    amount: newAmount
                }])
                    .then((res: string) => {
                    })
                    .catch((err: ExceptionResponse) => {
                        console.log(err)
                    });

                let currentProductCarts = [...activeProductCarts];
                let selectedProductCartIndex = currentProductCarts.findIndex(x => x.id === productCartId);
                let selectedProductPointIndex = currentProductCarts[selectedProductCartIndex].exchangeAblePoints.findIndex(x => x.id === newProductPointId);
                currentProductCarts[selectedProductCartIndex].amountSelected = newAmount;
                if (isNotNull(checked)) {
                    currentProductCarts[selectedProductCartIndex].checked = checked;
                }
                currentProductCarts[selectedProductCartIndex].pointSelected = currentProductCarts[selectedProductCartIndex].exchangeAblePoints[selectedProductPointIndex];
                setActiveProductCarts([...currentProductCarts]);


                // let currentProductCarts = [...cart.productCarts];
                // let selectedProductCartIndex = currentProductCarts.findIndex(x => x.id === productCartId);
                // let selectedProductPointIndex = currentProductCarts[selectedProductCartIndex].exchangeAblePoints.findIndex(x => x.id === newProductPointId);
                // currentProductCarts[selectedProductCartIndex].amountSelected = newAmount;
                // currentProductCarts[selectedProductCartIndex].checked = checked;
                // currentProductCarts[selectedProductCartIndex].pointSelected = currentProductCarts[selectedProductCartIndex].exchangeAblePoints[selectedProductPointIndex];
                // setCart((prevCart) => ({
                //     ...prevCart,
                //     productCarts: currentProductCarts
                // }));
            }
        }
    }

    const removeProductCartMany = () => {
        if (activeProductCarts.filter(pc => pc.checked).length > 0) {
            setShowAlertDelete(prevState1 => ({
                ...prevState1,
                open: true,
                handleAccept: async () => {
                    console.log("accept")
                    setShowAlertDelete(prevState2 => ({...prevState2, open: false}));
                    let deleteProductCartRequests: UpdateProductCartRequest[] = [];
                    activeProductCarts.filter(x => x.checked).forEach((productCart, index) => {
                        deleteProductCartRequests.push({
                            productCartId: productCart.id,
                            amount: 0,
                            productPointId: productCart.pointSelected.id
                        });
                    })
                    updateProductCartsForCurrentCustomer(deleteProductCartRequests)
                        .then((res: string) => {
                            getCurrentCustomerCart()
                                .then((cartRes: Cart) => {
                                    setActiveProductCarts([...getActiveProductCart(cartRes)]);
                                })
                                .catch((err: ExceptionResponse) => {
                                    console.log(err);
                                });
                        })
                        .catch((err: ExceptionResponse) => {
                            console.log(err)
                        });
                },
                handleDenied: () => {
                    setShowAlertDelete(prevState3 => ({...prevState3, open: false}));
                }
            }));
        }
    }

    useEffect(() => {
        if (isAuthenticated()) {
            getCurrentCustomerCart()
                .then((cartRes: Cart) => {
                    setActiveProductCarts([...getActiveProductCart(cartRes)]);
                    setNonActiveProductCarts([...getNonActiveProductCart(cartRes)])
                })
                .catch((err: ExceptionResponse) => {
                    console.log(err);
                }).finally(() => {
                setIsShow(true)
            });
            getEnterpriseMembershipForCurrentCustomer()
                .then((resEnterpriseMemberships: EnterpriseMembership[]) => {
                    setEnterpriseMemberships(resEnterpriseMemberships);
                }).catch((err: ExceptionResponse) => {
                console.log(err);
            });
        } else {
            setIsShow(true)
        }

        document.title = "Giỏ Hàng";
    }, []);

    const moveToCheckout = () => {
        // TODO: handle other user change amount of product -> sync amount before go to checkout
        console.log("sdsdsdsdsd");
        if (totalItem == 0) {
            setShowAlertError(prevState1 => ({
                ...prevState1,
                open: true,
                handleAccept: () => {
                    setShowAlertError(prevState2 => ({
                        ...prevState2,
                        open: false
                    }));
                },
            }));
        } else {
            let productCartGroupByEnterprises: ProductCartGroupByEnterprise[] = groupProductCartsByEnterprise(activeProductCarts.filter(pc => pc.checked));
            console.log(productCartGroupByEnterprises);
            console.log(enterpriseMemberships)
            let errorItems: string[] = [];
            productCartGroupByEnterprises.forEach((productCartGroupByEnterprise) => {
                let membership: EnterpriseMembership = enterpriseMemberships.find(x => x.enterprise.id == productCartGroupByEnterprise.enterprise.id);
                if (membership.availablePoint < productCartGroupByEnterprise.orderTotal) {
                    errorItems.push(membership.enterprise.enterpriseName);
                }
            })
            if (errorItems.length == 0) {
                localStorage.setItem(PAYMENT_PROCESS, PaymentProcess.OPEN_PAYMENT);
                history.push({
                    pathname: CustomerRouter.checkoutPage,
                    state: {
                        content: activeProductCarts.filter(x => x.checked).map(x => x.id)
                    },
                });
            } else {
                setShowAlertError(prevState2 => ({
                    ...prevState2,
                    open: true,
                    title: "Bạn không có đủ điểm " + errorItems[0] + " để thực hiện mua hàng"
                }));
            }
        }
    }
    //
    // async function updateCustomerCart() {
    //     let updateProductCartRequests: UpdateProductCartRequest[] = [];
    //     cart.productCarts.forEach((productCart, index) => {
    //         updateProductCartRequests.push({
    //             productPointId: productCart.pointSelected.id,
    //             productCartId: productCart.id,
    //             amount: productCart.amountSelected
    //         })
    //     })
    //     await updateProductCartsForCurrentCustomer([...updateProductCartRequests])
    //         .then((res: string) => {
    //             return res;
    //         });
    // }

    //
    // /*TODO: switch to st else in react*/
    // window.onbeforeunload = (event) => {
    //     event.preventDefault();
    //     updateCustomerCart()
    //         .then((res: any) => {
    //             console.log(res);
    //         })
    // };

    const DisplayAlertDelete = () => {
        if (showAlertDelete.open) {
            return (
                <AlertDialog content={showAlertDelete.content} isShowContent={true} isShowDeniedBtn={true}
                             isShowAcceptBtn={true}
                             deniedText={showAlertDelete.deniedText} acceptText={showAlertDelete.acceptText}
                             handleAccept={showAlertDelete.handleAccept} handleDenied={showAlertDelete.handleDenied}
                             isOpen={showAlertDelete.open} title={showAlertDelete.title}/>
            )
        } else {
            return null;
        }
    }

    const DisplayAlertError = () => {
        if (showAlertError.open) {
            return (
                <AlertDialog
                    acceptText={showAlertError.acceptText} isShowAcceptBtn={true}
                    handleAccept={showAlertError.handleAccept} handleDenied={showAlertError.handleDenied}
                    isOpen={showAlertError.open} title={showAlertError.title}/>
            )
        } else {
            return null;
        }
    }

    const breadCrumbItems: BreadcrumbItem[] = [
        {
            title: "Giỏ Hàng",
            isLasted: true
        }
    ]

    return (
        <Box>
            <PageHeader breadCrumbItems={breadCrumbItems} title={"Giỏ Hàng"}/>
            <DisplayAlertError/>
            <DisplayAlertDelete/>
            {
                isShow ? (
                    <Box>
                        {
                            activeProductCarts.length > 0 ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={9}>
                                        <Box sx={{display: "flex", gap: 4, flexDirection: "column"}}>
                                            <ProductCartList productCarts={activeProductCarts} isShowActive={true}
                                                             onUpdateProductCart={(productCartId: number, newProductPointId: number, newAmount: number, checked: boolean) =>
                                                                 updateProductCart(productCartId, newProductPointId, newAmount, checked)}
                                                             onRemoveProductCartMany={() => removeProductCartMany()}
                                                             onToggleCheckAllProductCart={(checdked: boolean) => toggleCheckAllProductCart(checdked)}/>
                                            {
                                                nonActiveProductCarts.length > 0 && (
                                                    <ProductCartList productCarts={nonActiveProductCarts}
                                                                     onUpdateProductCart={(productCartId: number, newProductPointId: number, newAmount: number, checked: boolean) =>
                                                                         updateProductCart(productCartId, newProductPointId, newAmount, checked)}
                                                                     isShowActive={false}/>
                                                )
                                            }
                                        </Box>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}
                                             className={"sticky-sidebar"}>
                                            <OrderPointTotal
                                                productCartGroupByEnterprises={groupProductCartsByEnterprise(activeProductCarts.filter(pc => pc.checked))}/>
                                            <Button variant={"contained"} size={"large"} fullWidth
                                                    disabled={activeProductCarts.filter(x => x.checked).length == 0}
                                                    color={"error"}
                                                    onClick={() => moveToCheckout()}>Mua Hàng ({totalItem})</Button>
                                        </Box>
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
    );
}

export default CustomerCartPage;