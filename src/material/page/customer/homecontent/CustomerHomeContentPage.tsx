import * as React from "react";
import {useEffect, useState} from "react";
import {Catalog} from "../../../model/Catalog";
import {Enterprise} from "../../../model/Enterprise";
import {Link, useHistory} from "react-router-dom";
import {getAllMainCatalog} from "../../../service/catalog.service";
import {getAllEnterprise} from "../../../service/enterprise.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import PageSpinner from "../../common/share/PageSpinner";
import Box from "@mui/material/Box";
import {List, ListItem, ListItemButton, ListItemText, Stack} from "@mui/material";
import './CustomerHomeContentPage.scss';
import {ProductSearchPath} from "../../../model/request/ProductSearchPath";
import {AssetPath, CustomerRouter} from "../../../config/router";
import {createSearchQuery} from "../../../util/search.utils";
import Typography from "@mui/material/Typography";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Props {
    catalogs?: Catalog[],
    enterprises?: Enterprise[]
}

const CatalogList: React.FC<Props> = ({catalogs}) => {

    return (
        <Box sx={{backgroundColor: "#fff", borderRadius: 2, paddingTop: 2}}>
            <Typography fontWeight={"bold"} ml={2}>Danh mục</Typography>
            <List>
                {
                    catalogs.map((catalog, index) => {

                        let productSearchPath: ProductSearchPath = {
                            catalog: catalog.id
                        }

                        return (
                            <ListItem disablePadding key={index}>
                                <ListItemButton
                                    href={CustomerRouter.productCollectionPage + createSearchQuery(productSearchPath)}>
                                    <img src={`${AssetPath.catalogLogoUrl}${catalog.logoUrl}`} alt={"img"}
                                         style={{
                                             width: "40px",
                                             display: "block",
                                             marginRight: "8px"
                                         }}/>
                                    <ListItemText primary={catalog.catalogName}/>
                                </ListItemButton>
                            </ListItem>
                        )
                    })
                }
            </List>
        </Box>
    )
}

const EnterpriseList: React.FC<Props> = ({enterprises}) => {

    function SamplePrevArrow(props) {
        const {className, style, onClick} = props;
        return (
            <div
                className={className}
                style={{...style, display: "block", width: "50px", height: "50px"}}
                onClick={onClick}
            />
        );
    }

    const settings = {
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1
    };

    return (
        <Box sx={{backgroundColor: "#fff", p: 2, borderRadius: 2}}>
            <Typography fontWeight={"bold"} mb={2}>Thương hiệu chính hãng</Typography>
            <Slider {...settings}>
                {
                    enterprises.map((enterprise1, index) => {

                        let productSearchPath: ProductSearchPath = {
                            enterprise: [enterprise1.id]
                        }

                        return (
                            <Link
                                to={CustomerRouter.productCollectionPage + createSearchQuery(productSearchPath)}
                                key={index} className={index != 0 ? "enterprise-link" : null}>
                                <Stack spacing={1} alignItems={"center"} className={"enterprise-item"}>
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 1,
                                        borderTopLeftRadius: "8px",
                                        borderTopRightRadius: "8px",
                                        backgroundColor: "var(--bluebreak-100)"
                                    }}>
                                        <img src={AssetPath.enterpriseLogoUrl + enterprise1.logoUrl}
                                             style={{width: "100%", borderRadius: "8px"}}/>
                                    </Box>
                                    <Typography align={"center"}
                                                style={{marginBottom: "8px"}}>{enterprise1.enterpriseName}</Typography>
                                </Stack>
                            </Link>
                        )
                    })
                }
            </Slider>
        </Box>
    )
}

const CustomerHomeContentPage: React.FC<Props> = () => {

    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);

    const history = useHistory();

    useEffect(() => {

        getAllMainCatalog()
            .then((resCatalogs: Catalog[]) => {
                setCatalogs(resCatalogs);

                getAllEnterprise()
                    .then((resEnterprises: Enterprise[]) => {
                        setEnterprises(resEnterprises);
                    }).catch((err: ExceptionResponse) => {
                    console.log(err);
                });

            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
            .finally(() => {
                setIsShow(true);
            })

        document.title = "Shopal - Tích điểm đổi quà";

    }, []);

    if (isShow) {
        return (
            <Box sx={{display: "flex", gap: 2}} className={"customer-home-content-page"}>
                <Box sx={{width: "20%"}}>
                    <CatalogList catalogs={catalogs}/>
                </Box>
                <Box sx={{width: "80%"}}>
                    <EnterpriseList enterprises={enterprises}/>
                </Box>
            </Box>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }

}

export default CustomerHomeContentPage