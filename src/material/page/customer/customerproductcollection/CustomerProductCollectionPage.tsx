import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {Catalog} from "../../../model/Catalog";
import {getAllCatalog} from "../../../service/catalog.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import PageSpinner from "../../common/share/PageSpinner";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import './customerproductcollectionpage.css';
import {Card, CardMedia, Rating} from "@mui/material";
import {Enterprise} from "../../../model/Enterprise";
import {getAllEnterprise} from "../../../service/enterprise.service";
import Button from "@mui/material/Button";
import {Product} from "../../../model/Product";
import CardContent from "@mui/material/CardContent";
import {AssetPath, CustomerRouter} from "../../../config/router";
import {Link, useHistory} from "react-router-dom";
import {ProductSearchPath} from "../../../model/request/ProductSearchPath";
import {ProductSearchCriteriaRequest} from "../../../model/request/ProductSearchCriteriaRequest";
import {getModelFromSearchParams, productSearchPathToProductSearchCriteriaRequest} from "../../../util/search.utils";
import {getProductByCriteria} from "../../../service/product.service";
import {createSeoLink} from "../../../util/url.util";
import Avatar from "@mui/material/Avatar";

interface Props {
    catalogs?: Catalog[],
    enterprises?: Enterprise[],
    products?: Product[],

    title?: string,
    isTitleKeyword?: boolean
}

const SearchCriteriaList: React.FC<Props> = ({catalogs, enterprises}) => {

    const [checkedEnterprise, setCheckedEnterprise] = React.useState([0]);

    const handleToggleEnterprise = (enterpriseId: number) => () => {
        const currentIndex = checkedEnterprise.indexOf(enterpriseId);
        const newChecked = [...checkedEnterprise];

        if (currentIndex === -1) {
            newChecked.push(enterpriseId);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedEnterprise(newChecked);
    };

    return (
        <Box sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 2,
        }}>
            <Box sx={{px: 2, pt: 2, borderTopLeftRadius: 2, borderTopRightRadius: 2}}>
                <Box style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                    <Typography fontWeight={"bold"}>Related Catalog</Typography>
                    {catalogs.map((catalog, index) => {
                        return (
                            <Link to={"/"} style={{fontSize: "12px"}}
                                  key={index} className={"selectLink"}>{catalog.productTypeDescription}</Link>
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
                                <Typography fontSize={"12px"} className={"selectLink"}>from {star} star</Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            <Divider/>
            <Box sx={{px: 2}}>
                <Box style={{display: "flex", flexDirection: "column"}}>
                    <Typography fontWeight={"bold"} style={{marginBottom: "8px"}}>Supplier</Typography>
                    {enterprises.map((enterprise, index) => {
                        return (
                            <Box sx={{display: "flex", alignItems: "center"}} key={index}>
                                <Checkbox
                                    edge="start"
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
                                <Typography fontSize={"12px"}>{enterprise.enterpriseName}</Typography>

                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    )
}

const ProductCollectionHeader: React.FC<Props> = ({title}) => {

    return (
        <Box sx={{p: 2, display: "flex", flexDirection: "column", gap: 2, borderRadius: 2, backgroundColor: "#fff"}}>
            <Typography variant={"h6"}>Search result for <Link to="/"
                                                               className={"keyword"}>{title}</Link></Typography>
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
                            key={index}>
                            <Card sx={{width: "100%"}} className={"cartItem"}>
                                <CardMedia
                                    sx={{height: 200, p: 5}}
                                    image={AssetPath.productImgUrl + product.mainImgUrl}
                                    title="green iguana"
                                />
                                <CardContent style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                                    <Box sx={{height: "32px"}}>
                                        <Typography className={"productName"}>{product.productName}</Typography>
                                    </Box>
                                    <Box sx={{display: "flex", alignItems: "center"}}>
                                        <Typography>{product.rating}</Typography>
                                        <Rating name="read-only" value={1} max={1} readOnly size="small"
                                                style={{position: "relative", bottom: 1, marginLeft: 0.5}}/>
                                        <Typography
                                            style={{position: "relative", bottom: 1, margin: "auto 8px"}}>|</Typography>
                                        <Typography>500+ Sold</Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        {
                                            product.exchangeAblePoints.map((productPoint, index) => (
                                                <Grid item xs={4} key={index}>
                                                    <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                                        <Typography
                                                            color={"#FF424E"}>{productPoint.pointExchange}</Typography>
                                                        <Avatar alt="img"
                                                                src={AssetPath.enterpriseLogoUrl + productPoint.enterprise.logoUrl}
                                                                sx={{width: 20, height: 20}}/>
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

    const [isTitleKeyword, setIsTitleKeyword] = useState<boolean>(false);
    const [title, setTitle] = useState<string>();

    const history = useHistory();
    const query = new URLSearchParams(window.location.search);

    useEffect(() => {

        let newProductSearchPath: ProductSearchPath = {
            catalog: null,
            enterprise: [],
            rating: null,
            keyword: null
        }
        newProductSearchPath = getModelFromSearchParams(query, newProductSearchPath);

        if (newProductSearchPath.catalog == null && newProductSearchPath.keyword == null && newProductSearchPath.enterprise == null) {
            history.push(CustomerRouter.homePage)
        } else {
            if (newProductSearchPath.keyword != null) {
                setTitle(newProductSearchPath.keyword);
                setIsTitleKeyword(true);
            }
        }

        let productSearchRequest: ProductSearchCriteriaRequest = productSearchPathToProductSearchCriteriaRequest(newProductSearchPath);
        getAllCatalog()
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
                    })

            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
            .finally(() => {
                setIsShow(true);
            })
    }, [window.location.search]);

    if (isShow) {
        return (
            <Box sx={{display: "flex", justifyContent: "space-between", gap: 2}} className={"productCollectionPage"}>
                <Box width={"20%"}>
                    <SearchCriteriaList catalogs={catalogs.filter(x => x.id <= 5)} enterprises={enterprises}/>
                </Box>
                <Box width={"80%"} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    <ProductCollectionHeader title={title}/>
                    <ProductCollectionContent products={products}/>
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