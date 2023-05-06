import * as React from 'react';
import {useEffect, useState} from 'react';
import {ProductDetail} from "../../../model/ProductDetail";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {ButtonGroup, Grid, Rating} from '@mui/material';
import ImageGallery from 'react-image-gallery';
import {AssetPath, CustomerRouter} from '../../../config/router';
import {ProductImage} from "../../../model/ProductImage";
import "react-image-gallery/styles/css/image-gallery.css";
import {isAuthenticated} from "../../../util/auth.util";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {getProductDetail} from "../../../service/product.service";
import {Link, useHistory, useParams} from "react-router-dom";
import './customerproductdetailpage.css'
import Avatar from "@mui/material/Avatar";
import {UpdateProductCartRequest} from "../../../model/request/UpdateProductCartRequest";
import {updateProductCartsForCurrentCustomer} from "../../../service/cart.service";
import {Cart} from "../../../model/Cart";
import AlertDialog from "../../common/share/AlertDialog";

interface RouteParams {
    productId: any;
}

interface Props {
    productDetail?: ProductDetail,
    onClickAddToCart?: Function
}

interface Image {
    original: string,
    thumbnail: string,
    originalHeight: string,
    originalWidth: string,
    thumbnailHeight: string,
    thumbnailWidth: string
}

const ProductInfo: React.FC<Props> = ({productDetail, onClickAddToCart}) => {

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
        setSelectProductPointId(productDetail.exchangeAblePoints[0].id);
    }, [productDetail]);

    return (
        <Box sx={{
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
                gap: 2,
                p: 2
            }}
            >
                <Typography variant="h6" align={"left"}
                            color={"rgb(36, 36, 36)"}>{productDetail.productName}</Typography>
                <Box sx={{display: "flex", gap: 2}}>
                    {/* TODO: add feature review */}
                    <Rating value={productDetail.rating} readOnly/>
                    <Link to={"/"} className={"starReview"}
                          style={{position: "relative", top: 1, textDecoration: "none"}}>See
                        9
                        reviews</Link>
                    <Typography>|</Typography>
                    {/* TODO: get purchased order amount*/}
                    <Typography style={{position: "relative", top: 2}}>500 Sold</Typography>
                </Box>
                <Grid container spacing={2}>
                    {
                        productDetail.exchangeAblePoints.map((productPoint, index) => (
                            <Grid item xs={3} key={index}>
                                <Button variant="outlined" className={"pointDescription"}
                                        sx={{
                                            display: "flex",
                                            width: "100%",
                                            alignItems: "center",
                                            gap: 1,
                                            justifyContent: "center",
                                            color: productPoint.id == selectProductPointId ? 'red' : ''
                                        }}
                                        onClick={() => {
                                            setSelectProductPointId(productPoint.id);
                                        }}
                                >
                                    <Typography variant={"h6"}
                                                color={"##0060FF"}>{productPoint.pointExchange}</Typography>
                                    <Avatar alt="img"
                                            src={AssetPath.enterpriseLogoUrl + productPoint.enterprise.logoUrl}
                                            sx={{width: 40, height: 40}}/>
                                </Button>
                            </Grid>
                        ))
                    }
                </Grid>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Typography width={"70px"} align={"left"}>Amount</Typography>
                    <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                        <button onClick={() => setAmount(amount > 1 ? amount - 1 : amount)} className={"amountBtn"}>-
                        </button>
                        {/* TODO: handle 0 amount */}
                        <input className={"amountInput"} id={"amount"} value={amount}
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
                        <button className={"amountBtn"}
                                onClick={() => setAmount(amount < productDetail.quantityInStock ? amount + 1 : amount)}
                        >+
                        </button>
                    </ButtonGroup>
                    <Typography>{productDetail.quantityInStock - amount} Available</Typography>
                </Box>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Button variant="outlined" size="large"
                            onClick={() => onClickAddToCart(amount, selectProductPointId, false)}
                            sx={{width: "100%"}}>Add to cart</Button>
                    <Button variant="contained" size="large" sx={{width: "100%"}}
                            onClick={() => onClickAddToCart(amount, selectProductPointId, true)}>Buy now</Button>
                </Box>
            </Box>
        </Box>
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
            <Typography variant="h6">Product Specifications
            </Typography>
        </Box>
    )
}


const ProductIntroDescription: React.FC<Props> = (product) => {

    return (
        <Box sx={{
            borderRadius: 2,
            display: "flex",
            backgroundColor: "#fff",
            p: 2
        }}>
            <Typography variant="h6">Product Description</Typography>
        </Box>
    )
}


const CustomerProductDetailPage: React.FC<Props> = () => {

    const params: RouteParams = useParams()
    const [productDetail, setProductDetail] = useState<ProductDetail>();
    const history = useHistory();


    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "Add product to cart successfully"
    });

    useEffect(() => {
        getProductDetail(params.productId)
            .then((productDetailRes: ProductDetail) => {
                setProductDetail(productDetailRes);
                console.log(productDetailRes);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
                // history.push({
                //     pathname: CustomerRouter.errorPage,
                //     state: {
                //         content: "Xin lỗi, sản phẩm bạn đang tìm kiếm không tồn tại"
                //     },
                // });
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
                    console.log("Add to cart successfully");
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
                             onClickAddToCart={(amount: number, selectProductPointId: number, isBoyNow: boolean) => handleAddToCart(amount, selectProductPointId, isBoyNow)}/>
                <Grid container spacing={2}>
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
                </Grid>
            </Box>
        )
            ;
    } else {
        return (
            <h1>Still loading</h1>
        );
    }
}

export default CustomerProductDetailPage;
