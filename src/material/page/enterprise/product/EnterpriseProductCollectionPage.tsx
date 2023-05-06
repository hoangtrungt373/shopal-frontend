import * as React from "react";
import {useEffect, useState} from "react";
import {Enterprise} from "../../../model/Enterprise";
import {Box, Chip, Rating} from "@mui/material";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import {Product} from "../../../model/Product";
import {getProductByCriteria} from "../../../service/product.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {useHistory} from "react-router-dom";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef, GridToolbar} from "@mui/x-data-grid-premium";
import {AssetPath, EnterpriseRouter} from "../../../config/router";
import {createSeoLink, formatVndMoney} from "../../../util/url.util";
import {ProductStatus} from "../../../model/enums/ProductStatus";


interface Props {
    products: Product[]
}


const ProductList: React.FC<Props> = ({products}) => {

    const history = useHistory();

    /*TODO: implement pagination*/
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.1,
        },
        {
            field: 'img',
            headerName: 'Product',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                return (
                    <img src={`${AssetPath.productImgUrl}${params.row.mainImgUrl}`} alt={"img"}
                         style={{
                             width: "40px",
                             display: "block"
                         }}/>
                );
            }
        },
        {
            field: 'productName',
            headerName: 'Name',
            flex: 0.7
        },
        {
            field: 'rating',
            headerName: 'Rating',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                return (
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Typography>{params.row.rating}</Typography>
                        <Rating name="read-only" value={1} max={1} readOnly size="small"
                                style={{position: "relative", bottom: 1, marginLeft: 0.5}}/>
                    </Box>
                );
            }
        },
        {
            field: 'amountSold',
            headerName: 'Purchased',
            flex: 0.3
        },
        {
            field: 'quantityInStock',
            headerName: 'Stock',
            flex: 0.3
        },
        {
            field: 'productStatus',
            headerName: 'Status',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                let productStatus: ProductStatus = params.row.productStatus;
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
                    <Chip label={params.row.productStatusDescription}
                          style={{backgroundColor: chipBgColor, color: chipTextColor}}/>
                );
            }
        },
        {
            field: 'initialCash',
            headerName: 'Initial Cash',
            flex: 0.5,
            valueGetter: ({value}) => value && formatVndMoney(value),
        },
        {
            field: 'inputDate',
            headerName: 'Input Date',
            flex: 0.5
        },
        {
            field: 'expirationDate',
            headerName: 'Expiration Date',
            flex: 0.5
        },
        {
            field: 'actions',
            headerName: 'Action',
            type: 'actions',
            flex: 0.3,
            getActions: (params) => [
                <GridActionsCellItem
                    label="Detail"
                    showInMenu
                    onClick={() => history.push(EnterpriseRouter.productCollectionPage + "/" + createSeoLink(params.row.productName) + "." + params.id)}
                />,
                <GridActionsCellItem
                    label="Request sell"
                    showInMenu
                    onClick={() => history.push(EnterpriseRouter.productCollectionPage + "/" + createSeoLink(params.row.productName) + "." + params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={products}
                columns={columns}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                slots={{
                    toolbar: GridToolbar,
                }}
            />
        </Box>
    )
}

const EnterpriseProductCollectionPage: React.FC<Props> = ({}) => {

    const [products, setProducts] = useState<Product[]>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [currentEnterprise, setCurrentEnterprise] = useState<Enterprise>(null);

    useEffect(() => {
        getProductByCriteria({
            catalogIdList: [],
            enterpriseIdList: []
        }).then((resProducts: Product[]) => {
            setProducts(resProducts);
        }).catch((err: ExceptionResponse) => {
            console.log(err);
        }).finally(() => {
            setIsShow(true);
        })
    }, [])

    if (isShow) {
        return (
            <Box
                sx={{display: "flex", flexDirection: "column", gap: 2, backgroundColor: "#fff", p: 2, borderRadius: 2}}>
                <Typography variant={"h6"} fontWeight={"bold"}>Product</Typography>
                <ProductList products={products}/>
            </Box>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }

}

export default EnterpriseProductCollectionPage;