import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {Catalog} from "../../../model/Catalog";
import {getAllMainCatalog} from "../../../service/catalog.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import PageSpinner from "../../common/share/PageSpinner";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import './CustomerProductCollectionPage.scss';
import {Card, CardMedia, Pagination, Rating, Tooltip} from "@mui/material";
import {Enterprise} from "../../../model/Enterprise";
import {getAllEnterprise} from "../../../service/enterprise.service";
import Button from "@mui/material/Button";
import {Product} from "../../../model/Product";
import CardContent from "@mui/material/CardContent";
import {AssetPath, CustomerRouter} from "../../../config/router";
import {Link, useHistory} from "react-router-dom";
import {ProductSearchPath} from "../../../model/request/ProductSearchPath";
import {ProductSearchCriteriaRequest} from "../../../model/request/ProductSearchCriteriaRequest";
import {
    createSearchQuery,
    getModelFromSearchParams,
    productSearchPathToProductSearchCriteriaRequest
} from "../../../util/search.utils";
import {countProductByCriteria, getProductByCriteria} from "../../../service/product.service";
import {createSeoLink} from "../../../util/other.util";
import Avatar from "@mui/material/Avatar";
import {DEFAULT_SEARCH_LIMIT} from "../../../config/constants";

interface Props {
    catalogs?: Catalog[],
    enterprises?: Enterprise[],
    products?: Product[],

    title?: string,
    isTitleKeyword?: boolean,
    onClickCatalog?: Function,
    selectedCatalog?: number
    onClickRating?: Function,
    selectedRating?: number,
    onClickEnterprise?: Function,
    selectedEnterprises?: number[]
}

const SearchCriteriaList: React.FC<Props> = ({
                                                 catalogs,
                                                 enterprises,
                                                 onClickCatalog,
                                                 selectedCatalog,
                                                 onClickRating,
                                                 selectedRating,
                                                 onClickEnterprise,
                                                 selectedEnterprises,
                                             }) => {

    const [checkedEnterprise, setCheckedEnterprise] = React.useState([0]);

    /*TODO: search related catalog*/
    useEffect(() => {
        setCheckedEnterprise(selectedEnterprises.map(x => Number.parseInt(String(x))));
    }, [selectedEnterprises])


    const handleToggleEnterprise = (enterpriseId: number) => () => {
        const currentIndex = checkedEnterprise.indexOf(enterpriseId);
        const newChecked = [...checkedEnterprise];

        if (currentIndex === -1) {
            newChecked.push(enterpriseId);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedEnterprise(newChecked);
        onClickEnterprise(enterpriseId);
    };

    return (
        <Box sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 2,
        }} className={"search-block"}>
            <Box sx={{px: 2, pt: 2, borderTopLeftRadius: 2, borderTopRightRadius: 2}}>
                <Box style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                    <Typography fontWeight={"bold"}>Danh mục sản phẩm</Typography>
                    {catalogs.map((catalog, index) => {
                        return (
                            <Typography onClick={() => onClickCatalog(catalog.id)}
                                        key={index}
                                        className={catalog.id == selectedCatalog ? "select-link active" : "select-link"}>{catalog.catalogName}</Typography>
                        );
                    })}
                </Box>
            </Box>
            <Divider/>
            <Box sx={{px: 2}}>
                <Box style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                    <Typography fontWeight={"bold"}>Review</Typography>
                    {[5, 4, 3].map((star) => {
                        return (
                            <Box sx={{display: "flex", alignItems: "center", ml: -0.5}}>
                                <Rating name="read-only" value={star} readOnly sx={{mr: 1}} size="small"/>
                                <Typography
                                    className={star == selectedRating ? "select-link active" : "select-link"}
                                    onClick={() => onClickRating(star)}>from {star} star</Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            <Divider/>
            <Box sx={{px: 2}}>
                <Box style={{display: "flex", flexDirection: "column"}}>
                    <Typography fontWeight={"bold"} style={{marginBottom: "8px"}}>Nhà cung cấp</Typography>
                    {enterprises.map((enterprise, index) => {


                        return (
                            <Box sx={{display: "flex", alignItems: "center"}} key={index}>
                                <Checkbox
                                    edge="start"
                                    defaultChecked={checkedEnterprise.indexOf(enterprise.id) !== -1}
                                    checked={checkedEnterprise.indexOf(enterprise.id) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    style={{
                                        transform: "scale(0.8)",
                                        padding: "6px"
                                    }}
                                    size={"small"}
                                    onClick={handleToggleEnterprise(enterprise.id)}

                                />
                                <Typography style={{cursor: "auto"}}
                                            className={checkedEnterprise.indexOf(enterprise.id) !== -1 ? "select-link active" : "select-link"}>{enterprise.enterpriseName}</Typography>

                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    )
}

const ProductCollectionHeader: React.FC<Props> = ({title, isTitleKeyword}) => {

    return (
        <Box sx={{p: 2, display: "flex", flexDirection: "column", gap: 2, borderRadius: 2, backgroundColor: "#fff"}}>
            {
                isTitleKeyword ? (
                    <Typography variant={"h6"}>Kết quả tìm kiếm cho <Link to="/"
                                                                          className={"keyword"}>{title}</Link></Typography>
                ) : (
                    <Typography variant={"h6"}>{title}</Typography>
                )
            }

            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <Button variant={"outlined"} size={"small"}>Pho bien</Button>
                <Button variant={"outlined"} size={"small"}>Ban chay</Button>
                <Button variant={"outlined"} size={"small"}>Hang moi</Button>
            </Box>
        </Box>
    )
}

const ProductCollectionContent: React.FC<Props> = ({products}) => {

    return (
        <Grid container spacing={2}>
            {
                products.map((product, index) => (
                    <Grid item xs={3}>
                        <Link
                            to={CustomerRouter.productDetailPage + "/" + createSeoLink(product.productName) + "." + product.id}
                            key={index} style={{textDecoration: "none"}}>
                            <Card sx={{width: "100%"}} className={"cart-item"}>
                                <CardMedia
                                    sx={{height: 200, p: 5}}
                                    image={AssetPath.productImgUrl + product.mainImgUrl}
                                    title="green iguana"
                                />
                                <CardContent style={{display: "flex", flexDirection: "column", gap: "8px"}}
                                             className={"product-card"}>
                                    <Box sx={{height: "32px"}}>
                                        <Typography className={"product-name"}>{product.productName}</Typography>
                                    </Box>
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        <Typography>{product.rating}</Typography>
                                        <Rating name="read-only" value={1} max={1} readOnly size="small"
                                                style={{position: "relative", bottom: 1, marginLeft: 0.5}}/>
                                        <Typography
                                            style={{position: "relative", bottom: 1, margin: "auto 8px"}}>|</Typography>
                                        <Typography>{product.totalSold}+ Sold</Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        {
                                            product.exchangeAblePoints.map((productPoint, index) => (
                                                <Grid item xs={3} key={index}>
                                                    <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                                        <Typography fontWeight={"bold"}
                                                                    color={"#FF424E"}>{productPoint.pointExchange}</Typography>
                                                        <Tooltip title={productPoint.enterprise.enterpriseName}
                                                                 key={index}>
                                                            <Avatar alt="img"
                                                                    src={AssetPath.enterpriseLogoUrl + productPoint.enterprise.logoUrl}
                                                                    sx={{width: 20, height: 20}}/>
                                                        </Tooltip>
                                                    </Box>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))
            }
        </Grid>
    )
}

const CustomerProductCollectionPage: React.FC<Props> = () => {

    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [products, setProducts] = useState<Product[]>([])
    const [isShow, setIsShow] = useState<boolean>(false);
    const [productSearchPath, setProductSearchPath] = useState<ProductSearchPath>();
    const [total, setTotal] = useState<number>();
    const [isTitleKeyword, setIsTitleKeyword] = useState<boolean>(false);
    const [title, setTitle] = useState<string>();

    const history = useHistory();
    const query = new URLSearchParams(window.location.search);

    useEffect(() => {

        let newProductSearchPath: ProductSearchPath = {
            catalog: null,
            enterprise: [],
            rating: null,
            keyword: null,
            page: 0
        }
        newProductSearchPath = getModelFromSearchParams(query, newProductSearchPath);

        if (newProductSearchPath.catalog == null && newProductSearchPath.keyword == null && newProductSearchPath.enterprise == null) {
            history.push(CustomerRouter.homePage)
        } else {
            if (newProductSearchPath.keyword != null) {
                setTitle(newProductSearchPath.keyword);
                setIsTitleKeyword(true);
            } else {
            }
        }
        console.log(newProductSearchPath)
        setProductSearchPath(newProductSearchPath);

        let productSearchRequest: ProductSearchCriteriaRequest = productSearchPathToProductSearchCriteriaRequest(newProductSearchPath);
        getAllMainCatalog()
            .then((resCatalogs: Catalog[]) => {
                setCatalogs(resCatalogs);

                getAllEnterprise()
                    .then((resEnterprises: Enterprise[]) => {
                        setEnterprises(resEnterprises);
                    }).catch((err: ExceptionResponse) => {
                    console.log(err);
                });

                getProductByCriteria(productSearchRequest)
                    .then((resProducts: Product[]) => {
                        setProducts(resProducts);
                    })
                    .catch((err: ExceptionResponse) => {
                        console.log(err);
                    });

                countProductByCriteria(productSearchRequest)
                    .then((resTotal: number) => {
                        setTotal(resTotal);
                        console.log(Math.ceil(resTotal / DEFAULT_SEARCH_LIMIT))
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
            })
    }, [window.location.search]);

    const handleClickCatalog = (catalogId: number) => {
        let newProductSearchPath = productSearchPath;
        newProductSearchPath.catalog = catalogId;
        refreshSearch(newProductSearchPath);
    }

    const handleClickRating = (star: number) => {
        let newProductSearchPath = productSearchPath;
        newProductSearchPath.rating = star;
        refreshSearch(newProductSearchPath);
    }

    const handleClickEnterprise = (enterpriseId: number) => {
        const currentIndex = productSearchPath.enterprise.findIndex(x => Number.parseInt(String(x)) == enterpriseId);
        const newChecked = [...productSearchPath.enterprise];

        if (currentIndex == -1) {
            newChecked.push(enterpriseId);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        let newProductSearchPath = productSearchPath;
        newProductSearchPath.enterprise = [...newChecked]
        refreshSearch(newProductSearchPath);
    }

    const handleChangePage = (page: number) => {
        let newProductSearchPath = productSearchPath;
        newProductSearchPath.page = page;
        refreshSearch(newProductSearchPath);
    }

    const refreshSearch = (productSearchPath: ProductSearchPath) => {
        history.push(CustomerRouter.productCollectionPage + createSearchQuery(productSearchPath));
    }

    if (isShow) {
        return (
            <Box sx={{display: "flex", justifyContent: "space-between", gap: 2}} className={"productCollectionPage"}>
                <Box width={"20%"}>
                    {
                        productSearchPath && (
                            <SearchCriteriaList catalogs={catalogs.filter(x => x.id <= 5)} enterprises={enterprises}
                                                selectedCatalog={productSearchPath.catalog}
                                                onClickCatalog={(catalogId: number) => handleClickCatalog(catalogId)}
                                                selectedRating={productSearchPath.rating}
                                                onClickRating={(star: number) => handleClickRating(star)}
                                                selectedEnterprises={productSearchPath.enterprise}
                                                onClickEnterprise={(enterpriseId: number) => handleClickEnterprise(enterpriseId)}/>
                        )
                    }
                </Box>
                <Box width={"80%"} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    <ProductCollectionHeader title={title} isTitleKeyword={true}/>
                    <ProductCollectionContent products={products}/>
                    <Pagination count={Math.ceil(total / DEFAULT_SEARCH_LIMIT)} color="primary" shape="rounded"
                                onChange={(e, page: number) => handleChangePage(page)}
                                sx={{margin: "32px auto 0px auto"}}/>

                </Box>
            </Box>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default CustomerProductCollectionPage;