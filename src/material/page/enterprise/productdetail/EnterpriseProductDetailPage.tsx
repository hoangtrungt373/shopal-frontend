import * as React from "react";
import {useEffect, useState} from "react";
import {
    getProductDetailForCustomer,
    handleRequestCancellingProductForCurrentEnterprise,
    handleRequestSellingProductForCurrentEnterprise
} from "../../../service/product.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {Box, Chip, Rating, Stack} from "@mui/material";
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
import {formatVndMoney} from "../../../util/url.util";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import AlertDialog from "../../common/share/AlertDialog";
import {ProductStatus} from "../../../model/enums/ProductStatus";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import AdminPageHeader from "../../common/admin/AdminPageHeader";

interface Props {
    productDetail?: ProductDetail
    currentEnterprise?: Enterprise
    onRequestSelling?: Function
    onRequestCancel?: Function
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
                                          onRequestSelling
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
                        <Typography>{Math.round(productDetail.initialCash / currentEnterprise.contract.cashPerPoint)}</Typography>
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
                        <Typography>{productDetail.amountSold}</Typography>
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
                            <Button variant={"outlined"} fullWidth disabled={true} size={"large"}>Cooperating</Button>
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
            </Box>
        </Stack>
    )
}

const EnterpriseProductDetailPage: React.FC<Props> = ({}) => {

    const params: RouteParams = useParams()
    const [productDetail, setProductDetail] = useState<ProductDetail>();
    const [currentEnterprise, setCurrentEnterprise] = useState<Enterprise>()
    const [breadCrumbItems, setBreadCrumbItems] = useState<BreadcrumbItem[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "",
        content: null,
        showDeniedBtn: true,
        acceptText: "Accept",
        deniedText: "Denied",
        handleDenied: null,
        handleAccept: null
    });
    const history = useHistory();

    useEffect(() => {
        getProductDetailForCustomer(params.productId)
            .then((productDetailRes: ProductDetail) => {
                setProductDetail(productDetailRes);
                getCurrentEnterpriseInfo()
                    .then((resEnterprise: Enterprise) => {
                        console.log(resEnterprise)
                        setCurrentEnterprise(resEnterprise);
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
        setShowAlert(prevState1 => ({
            ...prevState1,
            open: true,
            title: "Request selling this product?",
            handleAccept: async () => {
                handleRequestSellingProductForCurrentEnterprise(params.productId)
                    .then(() => {
                        getProductDetailForCustomer(params.productId)
                            .then((productDetailRes: ProductDetail) => {
                                setProductDetail(productDetailRes);
                            })
                            .catch((err: ExceptionResponse) => {
                            })
                    }).catch((err: ExceptionResponse) => {
                    if (err.status == 409) {
                        setShowAlert(prevState2 => ({
                            ...prevState2,
                            title: err.errorMessage,
                            showDeniedBtn: false,
                            acceptText: "OK, got it",
                            handleAccept: () => {
                                setShowAlert(prevState3 => ({...prevState3, open: false}));
                            },
                        }));
                    } else {
                        console.log(err);
                    }
                }).finally(() => {
                    setShowAlert(prevState2 => ({...prevState2, open: false}));
                });
            },
            handleDenied: () => {
                setShowAlert(prevState2 => ({...prevState2, open: false}));
            },
        }));

    }

    const handleRequestCancel = () => {
        setShowAlert(prevState1 => ({
            ...prevState1,
            open: true,
            title: "Cancel selling this product?",
            handleAccept: async () => {
                handleRequestCancellingProductForCurrentEnterprise(params.productId)
                    .then(() => {
                        getProductDetailForCustomer(params.productId)
                            .then((productDetailRes: ProductDetail) => {
                                setProductDetail(productDetailRes);
                            })
                            .catch((err: ExceptionResponse) => {
                            })
                    }).catch((err: ExceptionResponse) => {
                    if (err.status == 409) {
                        setShowAlert(prevState2 => ({
                            ...prevState2,
                            title: err.errorMessage,
                            showDeniedBtn: false,
                            acceptText: "OK, got it",
                            handleAccept: () => {
                                setShowAlert(prevState3 => ({...prevState3, open: false}));
                            },
                        }));
                    } else {
                        console.log(err);
                    }
                }).finally(() => {
                    setShowAlert(prevState2 => ({...prevState2, open: false}));
                });
            },
            handleDenied: () => {
                setShowAlert(prevState2 => ({...prevState2, open: false}));
            },
        }));
    }

    const DisplayAlert = () => {
        if (showAlert.open) {
            return (
                <AlertDialog content={showAlert.content} isShowContent={true} isShowDeniedBtn={showAlert.showDeniedBtn}
                             isShowAcceptBtn={true}
                             deniedText={showAlert.deniedText} acceptText={showAlert.acceptText}
                             handleAccept={showAlert.handleAccept} handleDenied={showAlert.handleDenied}
                             isOpen={showAlert.open} title={showAlert.title}/>
            )
        } else {
            return null;
        }
    }

    if (isShow) {
        return (
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <DisplayAlert/>
                <AdminPageHeader breadCrumbItems={breadCrumbItems} title={"Product Detail"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <Typography className={"page-sub-header"}>Product Detail: #{productDetail.id}</Typography>
                    <Divider style={{marginLeft: "-16px", marginRight: "-16px"}}/>
                    {
                        currentEnterprise && (
                            <ProductInfo productDetail={productDetail} currentEnterprise={currentEnterprise}
                                         onRequestCancel={() => handleRequestCancel()}
                                         onRequestSelling={() => handleRequestSelling()}/>
                        )
                    }
                </Box>
            </Box>
        )
            ;
    } else {
        return (
            <PageSpinner/>
        );
    }
}

export default EnterpriseProductDetailPage;
