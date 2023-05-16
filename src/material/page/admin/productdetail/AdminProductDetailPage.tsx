import * as React from "react";
import {useEffect, useState} from "react";
import {getProductDetailForAdmin} from "../../../service/product.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {Box, Chip, Rating, Stack, Tabs, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import {ProductDetail} from "../../../model/ProductDetail";
import {useParams} from "react-router-dom";
import Divider from "@mui/material/Divider";
import {ProductImage} from "../../../model/ProductImage";
import {AdminRouter, AssetPath} from "../../../config/router";
import ImageGallery from 'react-image-gallery';
import {Enterprise} from "../../../model/Enterprise";
import {formatVndMoney} from "../../../util/other.util";
import {ProductStatus} from "../../../model/enums/ProductStatus";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import {TabPanel} from "../../common/share/TabPanel";
import {a11yProps} from "../../common/share/a11yProps";

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
                                          productDetail
                                      }) => {

    const [images, setImages] = useState<Image[]>();

    useEffect(() => {
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
                        <Typography style={{width: "150px"}}>Type: </Typography>
                        <Typography>{productDetail.productType}</Typography>
                    </Box>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Box sx={{display: "flex", alignItems: "center", width: "50%"}}>
                        <Typography style={{width: "150px"}}>Input Date: </Typography>
                        <Typography>{productDetail.inputDate}</Typography>
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

                                return (
                                    <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                        <Typography fontSize={"14px"}>{productPoint.pointExchange}</Typography>
                                        <Tooltip title={productPoint.enterprise.enterpriseName} key={index}>
                                            <Avatar alt="img"
                                                    src={AssetPath.enterpriseLogoUrl + productPoint.enterprise.logoUrl}
                                                    sx={{width: 20, height: 20}}/>
                                        </Tooltip>
                                    </Box>
                                )
                            })
                        }
                    </Box>
                </Box>
                <Button variant={"contained"} fullWidth size={"large"}>Edit</Button>
            </Box>
        </Stack>
    )
}

const ProductDetailInfo: React.FC<Props> = ({productDetail}) => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Detail" {...a11yProps(0)} />
                    <Tab label="Reviews" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                Item one
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
        </Box>
    )
}

const AdminProductDetailPage: React.FC<Props> = ({}) => {

    const params: RouteParams = useParams()
    const [productDetail, setProductDetail] = useState<ProductDetail>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [breadCrumbItems, setBreadCrumbItems] = useState<BreadcrumbItem[]>([]);

    useEffect(() => {
        getProductDetailForAdmin(params.productId)
            .then((productDetailRes: ProductDetail) => {
                setProductDetail(productDetailRes);
                setBreadCrumbItems([
                    {
                        url: AdminRouter.productCollectionPage,
                        title: "Product",
                    },
                    {
                        title: productDetailRes.productName,
                        isLasted: true
                    },
                ]);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            }).finally(() => {
            setIsShow(true);
        })
    }, [params.productId]);

    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Product Detail"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <Typography className={"page-sub-header"}>Product Detail: #{productDetail.id}</Typography>
                    <Divider style={{marginLeft: "-16px", marginRight: "-16px"}}/>
                    <ProductInfo productDetail={productDetail}/>
                    {/*<ProductDetailInfo productDetail={productDetail}/>*/}
                </Box>
            </Stack>
        )
    } else {
        return (
            <PageSpinner/>
        );
    }
}

export default AdminProductDetailPage;
