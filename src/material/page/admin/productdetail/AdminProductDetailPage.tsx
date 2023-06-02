import * as React from "react";
import {useEffect, useState} from "react";
import {getProductDetail} from "../../../service/product.service";
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
import {createSeoLink, formatDateTime, formatRating, formatVndMoney} from "../../../util/display.util";
import {ProductStatus} from "../../../model/enums/ProductStatus";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import {TabPanel} from "../../common/share/TabPanel";
import {a11yProps} from "../../common/share/a11yProps";
import ArticleIcon from '@mui/icons-material/Article';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import ReactHtmlParser from 'react-html-parser';
import {ReviewOption} from "../../customer/productdetail/CustomerProductDetailPage";

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
        <Box>
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
                                    }}>{formatRating(productDetail.rating)}</span> out of
                                    5</Typography>
                                <Rating value={productDetail.rating} readOnly
                                        style={{fontSize: "28px", color: "#EE4D2D"}}/>
                            </Box>
                            <Box sx={{display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap"}}>
                                <button className={"show-review-btn active"}>Tất cả</button>
                                <button className={"show-review-btn"}>5
                                    star ({countByRating(5, 6)})
                                </button>
                                <button className={"show-review-btn"}>4
                                    star ({countByRating(4, 5)})
                                </button>
                                <button className={"show-review-btn"}>3
                                    star ({countByRating(3, 4)})
                                </button>
                                <button className={"show-review-btn"}>2
                                    star ({countByRating(2, 3)})
                                </button>
                                <button className={"show-review-btn"}>1
                                    star ({countByRating(1, 2)})
                                </button>
                                <button className={"show-review-btn"}>Have Comment
                                    ({countByHaveContent()})
                                </button>
                                <button className={"show-review-btn"}>Have Image / Video
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
                                            <Box sx={{marginLeft: "auto", justifySelf: "flex-end"}}>
                                                <Button color={"error"} variant={"outlined"}>Delete</Button>
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

    /*TODO: add InOrder field*/
    return (
        <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem/>}
            spacing={2}>
            <Box sx={{width: "40%"}}>
                <ImageGallery items={images ? images : []} showPlayButton={false}/>
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
                        }}>{formatRating(productDetail.rating)}</Typography>
                        <Rating value={productDetail.rating} readOnly/>
                    </Box>
                    <Divider orientation="vertical" flexItem/>
                    <Typography
                        style={{fontSize: "16px", cursor: "pointer"}}>{productDetail.totalReview} Reviews</Typography>
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
                        <Typography>{productDetail.productTypeDescription}</Typography>
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
                <Button variant={"contained"} style={{width: "20%"}}
                        href={AdminRouter.editProductPage + "/" + createSeoLink(productDetail.productName + "." + productDetail.id)}>Edit</Button>
            </Box>
        </Stack>
    )
}

export const ProductDetailInfo: React.FC<Props> = ({productDetail}) => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <Box sx={{width: '100%'}} mt={2}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
                    <Tab label="Description" {...a11yProps(0)} icon={<ArticleIcon/>} iconPosition="start"/>
                    <Tab label="Reviews" {...a11yProps(1)} icon={<StarHalfIcon/>} iconPosition="start"/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Box sx={{margin: "0px -24px"}}>
                    {ReactHtmlParser(productDetail.content)}
                </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Box sx={{margin: "0px -24px"}}>
                    <ProductReviewList productDetail={productDetail}/>
                </Box>
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
        document.title = "Admin - Product #" + params.productId;
        getProductDetail(params.productId)
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
                    <ProductDetailInfo productDetail={productDetail}/>
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
