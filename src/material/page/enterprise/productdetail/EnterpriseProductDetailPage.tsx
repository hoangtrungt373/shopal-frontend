import * as React from "react";
import {useEffect, useState} from "react";
import {
    getProductDetail,
    handleRequestCancellingProductForCurrentEnterprise,
    handleRequestSellingProductForCurrentEnterprise
} from "../../../service/product.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {Alert, Box, Chip, Rating, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import {ProductDetail} from "../../../model/ProductDetail";
import {useHistory, useParams} from "react-router-dom";
import Divider from "@mui/material/Divider";
import {ProductImage} from "../../../model/ProductImage";
import {AssetPath, EnterpriseRouter} from "../../../config/router";
import ImageGallery from 'react-image-gallery';
import {Enterprise} from "../../../model/Enterprise";
import {getCurrentEnterpriseInfo} from "../../../service/enterprise.service";
import {formatVndMoney} from "../../../util/display.util";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import {ProductStatus} from "../../../model/enums/ProductStatus";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import PageHeader from "../../common/share/PageHeader";
import {isNotNull} from "../../../util/object.util";
import {ProductDetailInfo} from "../../admin/productdetail/AdminProductDetailPage";

interface Props {
    productDetail?: ProductDetail
    currentEnterprise?: Enterprise
    onRequestSelling?: Function
    onRequestCancel?: Function
    showAlert?: any
}

interface RouteParams {
    productId: any;
}

interface Image {
    original: string,
    thumbnail: string,
    originalHeight: string,
    originalWidth: string,
    thumbnailHeight: string,
    thumbnailWidth: string
}

interface ChipStyle {
    bgColor: string;
    textColor: string
}

const ProductInfo: React.FC<Props> = ({
                                          productDetail,
                                          currentEnterprise,
                                          onRequestCancel,
                                          onRequestSelling,
                                          showAlert
                                      }) => {

    const [images, setImages] = useState<Image[]>();
    const [isCooperated, setIsCooperated] = useState<boolean>(false);


    useEffect(() => {
        console.log(productDetail)
        let newImages: Image[] = [];
        productDetail.imageUrls.forEach((productImage: ProductImage) => {
            newImages.push({
                original: AssetPath.productImgUrl + productImage.imageUrl,
                thumbnail: AssetPath.productImgUrl + productImage.imageUrl,
                originalHeight: "300ox",
                originalWidth: "300ox",
                thumbnailHeight: "70px",
                thumbnailWidth: "20px"
            })
        });
        setImages(newImages);
        let associatedEnterpriseId = productDetail.exchangeAblePoints.findIndex(x => x.enterprise.id == currentEnterprise.id && x.active);
        if (associatedEnterpriseId == -1) {
            setIsCooperated(false);
        } else {
            setIsCooperated(true);
        }
    }, [productDetail]);

    const ProductStatusChip: React.FC<Props> = () => {
        let productStatus: ProductStatus = productDetail.productStatus;
        let chipBgColor = null;
        let chipTextColor = "#212121";
        switch (productStatus) {
            case ProductStatus.INACTIVE: {
                chipBgColor = "#8A909D";
                chipTextColor = "#fff";
                break;
            }
            case ProductStatus.ACTIVE: {
                chipBgColor = "#29CC97";
                chipTextColor = "#fff";
                break;
            }
            default: {
                break;
            }
        }

        return (
            <Chip label={productDetail.productStatusDescription} size={"small"}
                  style={{backgroundColor: chipBgColor, color: chipTextColor, position: "relative", bottom: 1}}/>
        );
    }

    const chipColors: string[] = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#52c41a"];

    return (
        <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem/>}
            spacing={2}>
            <Box sx={{width: "40%"}}>
                <ImageGallery items={images ? images : []}
                              showFullscreenButton={false} showPlayButton={false}/>
            </Box>
            <Box sx={{
                width: "60%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                color: "#777777"
            }}>
                <Typography variant="h6" align={"left"}
                            color={"#56606e"}><ProductStatusChip/> {productDetail.productName}</Typography>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Box sx={{display: "flex", gap: 1, alignItems: "center", cursor: "pointer"}}>
                        <Typography fontSize={"16px"} style={{
                            color: "#FAAF00",
                            textDecoration: "underline",
                            fontWeight: "bold"
                        }}>{productDetail.rating}</Typography>
                        <Rating value={productDetail.rating} readOnly/>
                    </Box>
                    <Divider orientation="vertical" flexItem/>
                    <Typography style={{fontSize: "16px", cursor: "pointer"}}>500 Reviews</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Typography style={{width: "150px"}}>SKU: </Typography>
                    <Typography>#{productDetail.sku}</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Box sx={{display: "flex", alignItems: "center", width: "50%"}}>
                        <Typography style={{width: "150px", fontWeight: "bold", fontSize: "16px"}}>Initial
                            Cash: </Typography>
                        <Typography style={{
                            fontWeight: "bold",
                            fontSize: "16px"
                        }}>{formatVndMoney(productDetail.initialCash)}</Typography>
                    </Box>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Typography style={{width: "150px"}}>Input Date: </Typography>
                        <Typography>{productDetail.inputDate}</Typography>
                    </Box>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Box sx={{display: "flex", alignItems: "center", width: "50%"}}>
                        <Typography style={{width: "150px"}}>Point Exchange: </Typography>
                        {
                            isNotNull(currentEnterprise.contract) ? (
                                <Typography>{Math.round(productDetail.initialCash / currentEnterprise.contract.cashPerPoint)}</Typography>
                            ) : (
                                null
                            )
                        }
                        <Avatar alt="img"
                                src={AssetPath.enterpriseLogoUrl + currentEnterprise.logoUrl}
                                sx={{width: 15, height: 15, marginLeft: 0.5}}/>
                    </Box>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Typography style={{width: "150px"}}>Expiration Date: </Typography>
                        <Typography>{productDetail.expirationDate}</Typography>
                    </Box>
                </Box>
                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                    <Box sx={{
                        borderRadius: 5,
                        border: "2px solid #F3F3F3",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 1,
                        minWidth: 70
                    }}>
                        <Typography fontWeight={"bold"}>Available</Typography>
                        <Typography>{productDetail.quantityInStock}</Typography>
                    </Box>
                    <Box sx={{
                        borderRadius: 5,
                        border: "2px solid #F3F3F3",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 1,
                        minWidth: 70
                    }}>
                        <Typography fontWeight={"bold"}>Sold</Typography>
                        <Typography>{productDetail.totalSold}</Typography>
                    </Box>
                    <Box sx={{
                        borderRadius: 5,
                        border: "2px solid #F3F3F3",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 1,
                        minWidth: 70
                    }}>
                        <Typography fontWeight={"bold"}>InOrder</Typography>
                        <Typography>{20}</Typography>
                    </Box>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Typography>Associate selling enterprises: </Typography>
                    <Box sx={{display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap"}}>
                        {
                            productDetail.exchangeAblePoints.filter(x => x.active).map((productPoint, index) => {

                                let chipColor = chipColors[Math.round((chipColors.length) / index) - 1];
                                if (chipColor == undefined) {
                                    chipColor = chipColors[0];
                                }

                                return (
                                    <Chip label={productPoint.enterprise.enterpriseName} key={index} size={"small"}
                                          style={{
                                              backgroundColor: chipColor,
                                              color: "#fff"
                                          }}/>
                                )
                            })
                        }
                    </Box>
                </Box>
                {
                    isCooperated ? (
                        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                            <Button variant={"outlined"} fullWidth disabled={true} size={"large"}>Is Selling</Button>
                            <Button variant="text" size={"small"} color="error"
                                    style={{textDecoration: "underline"}}
                                    onClick={() => onRequestCancel()}>Cancel</Button>
                        </Box>
                    ) : (
                        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                            <Button variant={"contained"} fullWidth size={"large"} onClick={() => onRequestSelling()}>Request
                                selling</Button>
                        </Box>
                    )
                }
                {
                    showAlert.open && (
                        <Alert severity={showAlert.severity}>{showAlert.content}</Alert>
                    )
                }
            </Box>
        </Stack>
    )
}

const EnterpriseProductDetailPage: React.FC<Props> = ({currentEnterprise}) => {

    const params: RouteParams = useParams()
    const [productDetail, setProductDetail] = useState<ProductDetail>();
    const [breadCrumbItems, setBreadCrumbItems] = useState<BreadcrumbItem[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState({
        open: false,
        content: null,
        severity: null
    });
    const history = useHistory();

    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            setShowAlert(prevState4 => ({
                ...prevState4,
                open: false,
            }));
        }, 3000)

        return () => {
            clearTimeout(timeId)
        }

    }, [showAlert]);

    useEffect(() => {
        getProductDetail(params.productId)
            .then((productDetailRes: ProductDetail) => {
                document.title = currentEnterprise.enterpriseName + " - Product #" + params.productId;
                setProductDetail(productDetailRes);
                getCurrentEnterpriseInfo()
                    .then((resEnterprise: Enterprise) => {
                        console.log(resEnterprise)
                        setBreadCrumbItems([
                            {
                                url: EnterpriseRouter.productCollectionPage,
                                title: "Product",
                            },
                            {
                                title: productDetailRes.productName,
                                isLasted: true
                            },
                        ]);
                    }).catch((err: ExceptionResponse) => {
                    console.log(err);
                });
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            }).finally(() => {
            setIsShow(true);
        })
    }, [params.productId]);

    const handleRequestSelling = () => {
        handleRequestSellingProductForCurrentEnterprise(params.productId)
            .then((res: string) => {
                setShowAlert(prevState4 => ({
                    ...prevState4,
                    open: true,
                    content: res,
                    severity: "success"
                }));
            }).catch((err: ExceptionResponse) => {
            if (err.status == 409) {
                setShowAlert(prevState4 => ({
                    ...prevState4,
                    open: true,
                    content: err.errorMessage,
                    severity: "error"
                }));
            } else {
                console.log(err);
            }
        })
    }

    const handleRequestCancel = () => {
        handleRequestCancellingProductForCurrentEnterprise(params.productId)
            .then((res: string) => {
                setShowAlert(prevState4 => ({
                    ...prevState4,
                    open: true,
                    content: res,
                    severity: "success"
                }));
                getProductDetail(params.productId)
                    .then((productDetailRes: ProductDetail) => {
                        setProductDetail(productDetailRes);
                    })
                    .catch((err: ExceptionResponse) => {
                    })
            }).catch((err: ExceptionResponse) => {
            if (err.status == 409) {
                setShowAlert(prevState4 => ({
                    ...prevState4,
                    open: true,
                    content: err.errorMessage,
                    severity: "error"
                }));
            } else {
                console.log(err);
            }
        })
    }

    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Product Detail"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <Typography className={"page-sub-header"}>Product Detail: #{productDetail.id}</Typography>
                    <Divider style={{marginLeft: "-16px", marginRight: "-16px"}}/>
                    {
                        currentEnterprise && (
                            <ProductInfo productDetail={productDetail} currentEnterprise={currentEnterprise}
                                         showAlert={showAlert}
                                         onRequestCancel={() => handleRequestCancel()}
                                         onRequestSelling={() => handleRequestSelling()}/>
                        )
                    }
                    <ProductDetailInfo productDetail={productDetail}/>
                </Box>
            </Stack>
        )
            ;
    } else {
        return (
            <PageSpinner/>
        );
    }
}

export default EnterpriseProductDetailPage;
