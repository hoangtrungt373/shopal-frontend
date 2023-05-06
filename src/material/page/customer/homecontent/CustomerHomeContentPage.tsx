import * as React from "react";
import {useEffect, useState} from "react";
import {Catalog} from "../../../model/Catalog";
import {Enterprise} from "../../../model/Enterprise";
import {Link, useHistory} from "react-router-dom";
import {getAllCatalog} from "../../../service/catalog.service";
import {getAllEnterprise} from "../../../service/enterprise.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import PageSpinner from "../../common/share/PageSpinner";
import Box from "@mui/material/Box";
import {Card, CardMedia, Grid, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import './customerhomecontentpage.css';
import {ProductSearchPath} from "../../../model/request/ProductSearchPath";
import {AssetPath, CustomerRouter} from "../../../config/router";
import {createSearchQuery} from "../../../util/search.utils";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

interface Props {
    catalogs?: Catalog[],
    enterprises?: Enterprise[]
}

const CatalogList: React.FC<Props> = ({catalogs}) => {

    return (
        <Box sx={{backgroundColor: "#fff", borderRadius: 2, paddingTop: 2}}>
            <Typography fontWeight={"bold"} ml={2}>Catalog</Typography>
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
                                    <ListItemText primary={catalog.productTypeDescription}/>
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

    return (
        <Box sx={{backgroundColor: "#fff", p: 2, borderRadius: 2}}>
            <Typography fontWeight={"bold"} mb={2}>Genuine Brand</Typography>
            <Grid container spacing={2}>
                {
                    enterprises.map((enterprise1, index) => {

                        let productSearchPath: ProductSearchPath = {
                            enterprise: [enterprise1.id]
                        }

                        return (
                            <Grid item xs={3}>
                                <Link
                                    to={CustomerRouter.productCollectionPage + createSearchQuery(productSearchPath)}
                                    key={index}>
                                    <Card sx={{width: "100%"}} className={"enterpriseItem"}>
                                        <CardMedia
                                            sx={{height: 200, p: 5}}
                                            image={AssetPath.enterpriseLogoUrl + enterprise1.logoUrl}
                                            title="green iguana"
                                        />
                                        <CardContent>
                                            <Typography align={"center"}
                                                        fontSize={16}>{enterprise1.enterpriseName}</Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </Box>
    )
}

const CustomerHomeContentPage: React.FC<Props> = () => {

    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);

    const history = useHistory();

    useEffect(() => {

        getAllCatalog()
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
    }, []);

    if (isShow) {
        return (
            <Box sx={{display: "flex", gap: 2}} className={"homeContentPage"}>
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