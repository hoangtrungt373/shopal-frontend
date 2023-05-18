import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {ProductDetail} from "../../../model/ProductDetail";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {ButtonGroup, Grid, Rating, Stack, Tooltip} from '@mui/material';
import ImageGallery from 'react-image-gallery';
import {AssetPath, CustomerRouter} from '../../../config/router';
import {ProductImage} from "../../../model/ProductImage";
import "react-image-gallery/styles/css/image-gallery.css";
import {isAuthenticated} from "../../../util/auth.util";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {getProductDetail} from "../../../service/product.service";
import {useHistory, useParams} from "react-router-dom";
import './CustomerProductDetailPage.scss'
import Avatar from "@mui/material/Avatar";
import {UpdateProductCartRequest} from "../../../model/request/UpdateProductCartRequest";
import {updateProductCartsForCurrentCustomer} from "../../../service/cart.service";
import {Cart} from "../../../model/Cart";
import AlertDialog from "../../common/share/AlertDialog";
import PageSpinner from "../../common/share/PageSpinner";
import Divider from "@mui/material/Divider";
import {Product} from "../../../model/Product";
import ReactHtmlParser from 'react-html-parser';
import {formatDateTime, formatRating} from "../../../util/display.util";
import {getEnterpriseMembershipForCurrentCustomer} from "../../../service/membership.service";
import {EnterpriseMembership} from "../../../model/customer/EnterpriseMembership";

interface RouteParams {
    productId: any;
}

interface Props {
    productDetail?: ProductDetail,
    similarProducts?: Product[],
    onClickAddToCart?: Function,
    onScrollToReview?: Function
}

interface Image {
    original: string,
    thumbnail: string,
    originalHeight: string,
    originalWidth: string,
    thumbnailHeight: string,
    thumbnailWidth: string
}

export interface ReviewOption {
    ratingMin: number,
    ratingMax?: number,
    isHaveContent?: boolean,
    isHaveGallery?: boolean
}

const ProductInfo: React.FC<Props> = ({productDetail, onClickAddToCart, onScrollToReview}) => {

    const [amount, setAmount] = useState<number>(1);
    const [selectProductPointId, setSelectProductPointId] = useState<number>();
    const [images, setImages] = useState<Image[]>();


    useEffect(() => {
        console.log(productDetail)
        let newImages: Image[] = [];
        productDetail.imageUrls.forEach((productImage: ProductImage) => {
            newImages.push({
                original: AssetPath.productImgUrl + productImage.imageUrl,
                thumbnail: AssetPath.productImgUrl + productImage.imageUrl,
                originalHeight: "500ox",
                originalWidth: "500ox",
                thumbnailHeight: "80px",
                thumbnailWidth: "50px"
            })
        });
        setImages(newImages);
        if (productDetail.exchangeAblePoints.filter(x => !x.disable).length > 0) {
            setSelectProductPointId(productDetail.exchangeAblePoints.filter(x => !x.disable)[0].id)
        }
    }, [productDetail]);

    return (
        <Stack direction="row"
               divider={<Divider orientation="vertical" flexItem/>}
               sx={{
                   borderRadius: 2,
                   display: "flex",
                   backgroundColor: "#fff"
               }}>
            <Box sx={{width: "45%", p: 2}}>
                <ImageGallery items={images ? images : []}
                              showFullscreenButton={false} showPlayButton={false}/>
            </Box>
            <Box sx={{
                width: "55%",
                display: "flex",
                flexDirection: "column",
                p: 2,
                gap: 3
            }}
            >
                <Box sx={{display: "flex", flexDirection: "column"}}>
                    <Typography variant="h6" align={"left"} gutterBottom
                                color={"rgb(36, 36, 36)"}>{productDetail.productName}</Typography>
                    <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                        {/* TODO: add feature review */}
                        <Typography fontSize={"16px"} style={{
                            color: "#FAAF00",
                            textDecoration: "underline",
                            fontWeight: "bold",
                            position: "relative",
                            bottom: 1
                        }}>{formatRating(productDetail.rating)}</Typography>
                        <Rating value={productDetail.rating} readOnly size={"small"}
                                style={{position: "relative", bottom: 1}}/>
                        <Typography style={{cursor: "pointer"}} onClick={() => onScrollToReview()}>Xem
                            {" " + productDetail.totalReview + " "}
                            review</Typography>
                        <Typography style={{position: "relative", bottom: 2}}>|</Typography>
                        <Typography>{productDetail.totalSold} Đã bán</Typography>
                    </Box>
                </Box>
                <Box sx={{display: "flex", gap: 2, alignItems: "flex-start"}} className={'point-list'}>
                    <Typography width={"15.5%"} align={"left"} mt={"16px"}>Điểm</Typography>
                    <Box width={"85%"}>
                        <Grid container spacing={2}>
                            {
                                productDetail.exchangeAblePoints.map((productPoint, index) => (
                                    <Grid item xs={3} key={index}>
                                        <button disabled={productPoint.disable}
                                                className={productPoint.id != selectProductPointId ? "point-description" : "point-description active"}
                                                onClick={() => {
                                                    setSelectProductPointId(productPoint.id);
                                                }}
                                        >
                                            <Typography variant={"h6"}
                                                        color={"##0060FF"}>{productPoint.pointExchange}</Typography>
                                            <Tooltip title={productPoint.disable ?
                                                "Tài khoản này chưa là thành viên của " + productPoint.enterprise.enterpriseName :
                                                productPoint.enterprise.enterpriseName} key={index}>
                                                <Avatar alt="img"
                                                        src={AssetPath.enterpriseLogoUrl + productPoint.enterprise.logoUrl}
                                                        sx={{width: 30, height: 30}}/>
                                            </Tooltip>
                                        </button>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                </Box>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}
                     className={"btn-amount-group"}>
                    <Typography width={"15%"} align={"left"}>Số lượng</Typography>
                    <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                        <button onClick={() => setAmount(amount > 1 ? amount - 1 : amount)} className={"amount-btn"}>-
                        </button>
                        {/* TODO: handle 0 amount */}
                        <input className={"amount-input"} id={"amount"} value={amount}
                               onChange={event => {
                                   let newAmount = parseInt(event.target.value);
                                   if (Number.isNaN(newAmount)) {
                                       setAmount(null)
                                   } else if (newAmount > 0 && newAmount <= productDetail.quantityInStock) {
                                       setAmount(newAmount)
                                   }
                                   //TODO right now can not modify first number, handle it later
                               }}
                               onBlur={() => {
                                   if (amount == null) {
                                       setAmount(1)
                                   }
                               }}></input>
                        <button className={"amount-btn"}
                                onClick={() => setAmount(amount < productDetail.quantityInStock ? amount + 1 : amount)}
                        >+
                        </button>
                    </ButtonGroup>
                    <Typography>{productDetail.quantityInStock - amount} Available</Typography>
                </Box>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Button variant="outlined" size="large"
                            onClick={() => onClickAddToCart(amount, selectProductPointId, false)}
                            sx={{width: "100%"}}>Thêm vào giỏ hàng</Button>
                    <Button variant="contained" size="large" sx={{width: "100%"}}
                            onClick={() => onClickAddToCart(amount, selectProductPointId, true)}>Mua ngay</Button>
                </Box>
            </Box>
        </Stack>
    )
}

const ProductIntroDetail: React.FC<Props> = (product) => {

    return (
        <Box sx={{
            borderRadius: 2,
            display: "flex",
            backgroundColor: "#fff",
            p: 2
        }}>
            <Typography variant="h6">Thông Tin Chi Tiết
            </Typography>
        </Box>
    )
}


const ProductIntroDescription: React.FC<Props> = ({productDetail}) => {

    /* TODO: add read more read less*/
    return (
        <Box sx={{
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            p: 2
        }}>
            <Typography variant="h6" gutterBottom>Mô Tả Sản Phẩm</Typography>
            {ReactHtmlParser(productDetail.content)}
        </Box>
    )
}

const ProductReviewList: React.FC<Props> = ({productDetail}) => {

    const [reviewOption, setReviewOption] = useState<ReviewOption>({
        ratingMin: 1,
    })

    const countByRating = (ratingMin: number, ratingMax: number) => {
        return productDetail.reviews.filter(x => x.rating >= ratingMin && x.rating < ratingMax).length;
    }

    const countByHaveContent = () => {
        return productDetail.reviews.filter(x => x.content != null).length;
    }

    const countByHaveGallery = () => {
        return productDetail.reviews.filter(x => x.imageUrls.length > 0).length;
    }

    /* TODO: filter by review option*/
    return (
        <Box sx={{
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            p: 2,
        }}>
            <Typography variant="h6" mb={2}>Đánh Giá - Nhận Xét Từ Khách Hàng</Typography>
            {
                productDetail.reviews.length > 0 ? (
                    <Box>
                        <Box sx={{
                            display: "flex",
                            gap: 4,
                            alignItems: "center",
                            backgroundColor: "#FFFBF8",
                            p: 3,
                            mb: 3,
                            border: "1px solid var(--neutralgray-300)"
                        }}
                             className={"product-review-block"}
                        >
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                alignItems: "center",
                                color: "#EE4D2D"
                            }}>
                                <Typography style={{fontSize: "20px"}}><span
                                    style={{
                                        fontWeight: 500,
                                        fontSize: "28px"
                                    }}>{formatRating(productDetail.rating)}</span> trên
                                    5</Typography>
                                <Rating value={productDetail.rating} readOnly
                                        style={{fontSize: "28px", color: "#EE4D2D"}}/>
                            </Box>
                            <Box sx={{display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap"}}>
                                <button className={"show-review-btn active"}>Tất cả</button>
                                <button className={"show-review-btn"}>5
                                    sao ({countByRating(5, 6)})
                                </button>
                                <button className={"show-review-btn"}>4
                                    sao ({countByRating(4, 5)})
                                </button>
                                <button className={"show-review-btn"}>3
                                    sao ({countByRating(3, 4)})
                                </button>
                                <button className={"show-review-btn"}>2
                                    sao ({countByRating(2, 3)})
                                </button>
                                <button className={"show-review-btn"}>1
                                    sao ({countByRating(1, 2)})
                                </button>
                                <button className={"show-review-btn"}>Có Bình Luận
                                    ({countByHaveContent()})
                                </button>
                                <button className={"show-review-btn"}>Có Hình Ảnh / Video
                                    ({countByHaveGallery()})
                                </button>
                            </Box>
                        </Box>
                        <Stack spacing={2} divider={<Divider flexItem/>}>
                            {
                                productDetail.reviews.map((review, index) => {

                                    /*TODO: handle zoom image and reply*/
                                    return (
                                        <Box sx={{display: "flex", gap: 2}}>
                                            <Avatar alt="img"
                                                    src={AssetPath.customerAvatarUrl + review.customer.avatarUrl}
                                                    sx={{width: 50, height: 50}}/>
                                            <Box sx={{display: "flex", flexDirection: "column"}}>
                                                <Typography>{review.customer.fullName}</Typography>
                                                <Rating value={review.rating}
                                                        style={{fontSize: "18px", margin: "4px 0"}}/>
                                                <Typography
                                                    style={{
                                                        color: "rgba(0,0,0,.54)",
                                                        fontSize: "12px"
                                                    }}>{formatDateTime(review.reviewDate)}</Typography>
                                                <Typography mt={1} mb={1.5}>{review.content}</Typography>
                                                <Box sx={{display: "flex", flexWrap: "wrap", gap: 2}}>
                                                    {
                                                        review.imageUrls.map((imageUrl, index2) => (
                                                            <img
                                                                src={AssetPath.productReviewUrl + imageUrl}
                                                                alt={"img"}
                                                                style={{
                                                                    width: "70px",
                                                                    height: "70px",
                                                                    borderRadius: 2,
                                                                    cursor: "pointer"
                                                                }}/>
                                                        ))
                                                    }
                                                </Box>
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                        </Stack>
                    </Box>
                ) : (
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
                        <img src={AssetPath.noReviewImg} alt={"cart-empty"} width={"200px"}/>
                        <Typography>Chưa có đánh giá nào cho sản phẩm này</Typography>
                    </Box>
                )
            }
        </Box>
    )
}

const CustomerProductDetailPage: React.FC<Props> = () => {

    const params: RouteParams = useParams()
    const [productDetail, setProductDetail] = useState<ProductDetail>();
    const [similarProducts, setSimilarProducts] = useState<Product>();
    const [isShow, setIsShow] = useState<boolean>(false)
    const history = useHistory();
    const ref = useRef(null);

    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "Thêm sản phẩm vào giỏ hàng thành công"
    });

    useEffect(() => {
        getProductDetail(params.productId)
            .then((productDetailRes: ProductDetail) => {

                // TODO: get exactly similar product by catalog

                if (isAuthenticated()) {
                    getEnterpriseMembershipForCurrentCustomer()
                        .then((resEnterpriseMemberships: EnterpriseMembership[]) => {
                            productDetailRes.exchangeAblePoints.forEach(productPoint => {
                                if (resEnterpriseMemberships.findIndex(x => x.enterprise.id == productPoint.enterprise.id) == -1) {
                                    productPoint.disable = true;
                                }
                            })
                        }).finally(() => {
                        setProductDetail(productDetailRes);
                        setIsShow(true);
                    });
                } else {
                    setProductDetail(productDetailRes);
                    setIsShow(true);
                }

            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
                history.push({
                    pathname: CustomerRouter.errorPage,
                    state: {
                        content: "Sorry, the product you are searching for does not exists"
                    },
                });
            }).finally(() => {
            setIsShow(true);
        });
    }, [params.productId]);

    const handleAddToCart = async (amount, selectProductPointId, isBuynow) => {
        if (isAuthenticated() && productDetail) {
            /* TODO: handle add to cart*/
            let updateProductCartsRequest: UpdateProductCartRequest[] = [{
                productCartId: null,
                productPointId: selectProductPointId,
                amount: amount
            }];
            /*TODO: show notification*/
            await updateProductCartsForCurrentCustomer(updateProductCartsRequest)
                .then((cartRes: Cart) => {
                    setProductDetail(prevProductDetail => ({
                        ...prevProductDetail,
                        quantityInStock: productDetail.quantityInStock - updateProductCartsRequest[0].amount
                    }));
                    if (isBuynow) {
                        history.push({
                            pathname: CustomerRouter.cartPage
                        });
                    } else {
                        setShowAlert(prevState1 => ({
                            ...prevState1,
                            open: true,
                        }));
                    }
                })
                .catch((err: ExceptionResponse) => {
                    console.log(err);
                });
        } else {
            setShowAlert(prevState1 => ({
                ...prevState1,
                open: true,
                title: "Please login to add item to cart"
            }));
        }
    }

    const DisplayAlert = () => {
        if (showAlert.open) {
            return (
                <AlertDialog
                    isOpen={showAlert.open} title={showAlert.title}/>
            )
        } else {
            return null;
        }
    }

    if (productDetail) {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}} className={"productDetailPage"}>
                <DisplayAlert/>
                <ProductInfo productDetail={productDetail}
                             onScrollToReview={() => ref.current?.scrollIntoView({behavior: 'smooth'})}
                             onClickAddToCart={(amount: number, selectProductPointId: number, isBoyNow: boolean) => handleAddToCart(amount, selectProductPointId, isBoyNow)}/>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={{
                            borderRadius: 2,
                            display: "flex",
                            backgroundColor: "#fff",
                            p: 2
                        }}>
                            <Typography variant="h6">Sản Phẩm Tương Tự</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={9} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                        <ProductIntroDetail productDetail={productDetail}/>
                        <ProductIntroDescription productDetail={productDetail}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Box sx={{
                            borderRadius: 2,
                            display: "flex",
                            backgroundColor: "#fff",
                            p: 2
                        }}>
                            <Typography variant="h6">Ads here</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={9} ref={ref}>
                        <ProductReviewList productDetail={productDetail}/>
                    </Grid>
                </Grid>
            </Box>
        )
            ;
    } else {
        return (
            <PageSpinner/>
        );
    }
}

export default CustomerProductDetailPage;
