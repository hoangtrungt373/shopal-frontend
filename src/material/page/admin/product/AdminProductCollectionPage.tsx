import * as React from "react";
import {useEffect, useState} from "react";
import {Autocomplete, Box, Chip, MenuItem, Rating, Stack, Tooltip} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {Product} from "../../../model/Product";
import {useHistory} from "react-router-dom";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef, GridToolbar} from "@mui/x-data-grid-premium";
import {AdminRouter, AssetPath, EnterpriseRouter} from "../../../config/router";
import Typography from "@mui/material/Typography";
import {createSeoLink, formatVndMoney} from "../../../util/display.util";
import {getProductByCriteria} from "../../../service/product.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {ProductType} from "../../../model/enums/ProductType";
import {ProductStatus} from "../../../model/enums/ProductStatus";
import Avatar from "@mui/material/Avatar";
import {useForm} from "react-hook-form";
import TextField from "@mui/material/TextField";
import {ProductSearchCriteriaRequest} from "../../../model/request/ProductSearchCriteriaRequest";
import {GroupHeader} from "../../../model/common/GroupHeader";
import {Catalog} from "../../../model/Catalog";
import {GroupItems} from "../../../model/common/GroupItem";
import {getAllMainCatalog} from "../../../service/catalog.service";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {Enterprise} from "../../../model/Enterprise";
import {AbstractFilter} from "../../../model/AbstractFilter";
import {getAllEnterprise} from "../../../service/enterprise.service";
import {CustomerSearchCriteriaRequest} from "../../../model/request/CustomerSearchCriteriaRequest";


interface Props {
    products?: Product[],
    childCatalogs?: Catalog[]
    onSearchProduct?: Function,
    enterpriseFilters?: AbstractFilter[]
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Product",
        isLasted: true
    },
]
/*TODO: fetch from be*/
export const productTypeSearchOptions: AbstractFilter[] = [
    {
        label: "All",
        value: ProductType.ALL
    },
    {
        label: "Normal",
        value: ProductType.NORMAL
    },
    {
        label: "Voucher",
        value: ProductType.VOUCHER
    },
    {
        label: "Bill",
        value: ProductType.BILL
    },
]

/*TODO: fetch from be*/
export const productStatusSearchOptions: AbstractFilter[] = [
    {
        label: "All",
        value: ProductStatus.ALL
    },
    {
        label: "Inactive",
        value: ProductStatus.INACTIVE
    },
    {
        label: "Active",
        value: ProductStatus.ACTIVE
    },
]

const ProductSearch: React.FC<Props> = ({onSearchProduct, childCatalogs, enterpriseFilters}) => {

    const {
        register,
        setValue,
        reset,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm<ProductSearchCriteriaRequest>();
    const [selectedCatalog, setSelectedCatalog] = useState<Catalog>(null);
    const [selectedEnterprises, setSelectedEnterprises] = useState<AbstractFilter[]>([]);
    const [selectedProductType, setSelectedProductType] = useState<ProductType>(ProductType.ALL);
    const [selectedProductStatus, setSelectedProductStatus] = useState<ProductStatus>(ProductStatus.ALL);

    const onSubmit = handleSubmit(data => {
        let criteria: ProductSearchCriteriaRequest = {
            keyword: data.keyword,
            sku: data.sku,
            catalogIdList: selectedCatalog != null ? [selectedCatalog.id] : [],
            enterpriseIdList: [...selectedEnterprises.map(x => x.value)],
            productStatus: selectedProductStatus,
            productType: selectedProductType
        }
        onSearchProduct(criteria);
    });

    const handleChangeSelectedEnterprises = (e, value) => {
        setSelectedEnterprises([...value])
    }

    const handleClearFilter = () => {
        reset();
        setSelectedEnterprises([]);
        setSelectedCatalog(null);
        setSelectedProductType(ProductType.ALL);
        setSelectedProductStatus(ProductStatus.ALL);
        let criteria: CustomerSearchCriteriaRequest = {}
        onSearchProduct(criteria);
    }

    return (
        <Box sx={{display: "flex", gap: 2}}>
            <form onSubmit={onSubmit} style={{width: "100%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography gutterBottom>Keyword</Typography>
                        <TextField {...register("keyword")} fullWidth size={"small"}
                                   placeholder={"Product name"}/>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography gutterBottom>SKU</Typography>
                        <TextField {...register("sku")} fullWidth size={"small"} placeholder={"Product sku"}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom>Category</Typography>
                        <Autocomplete
                            id="grouped-demo"
                            options={childCatalogs}
                            groupBy={(catalog) => catalog.parentCatalogName}
                            getOptionLabel={(catalog) => catalog.catalogName}
                            value={selectedCatalog}
                            onChange={(e, value) => setSelectedCatalog(value)}
                            sx={{width: "100%"}}
                            renderInput={(params) => <TextField {...params}
                                                                size={"small"}/>}
                            renderGroup={(params) => (
                                <li key={params.key}>
                                    <GroupHeader>{params.group}</GroupHeader>
                                    <GroupItems>{params.children}</GroupItems>
                                </li>
                            )}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Typography gutterBottom>Type</Typography>
                        <TextField
                            select
                            defaultValue={ProductType.ALL}
                            value={selectedProductType}
                            onChange={(e) => setSelectedProductType(e.target.value as ProductType)}
                            size={"small"}
                            sx={{width: "100%"}}
                        >
                            {productTypeSearchOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography gutterBottom>
                            Enterprise
                        </Typography>
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={enterpriseFilters}
                            value={selectedEnterprises}
                            onChange={handleChangeSelectedEnterprises}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size={"small"}
                                    placeholder="Associate Enterprises"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Typography gutterBottom>Status</Typography>
                        <TextField
                            select
                            defaultValue={ProductStatus.ALL}
                            value={selectedProductStatus}
                            onChange={(e) => {
                                setSelectedProductStatus(e.target.value as ProductStatus);
                            }} size={"small"}
                            sx={{width: "100%"}}
                        >
                            {productStatusSearchOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography gutterBottom color={"#fff"}>empty</Typography>
                        <Button type={"submit"} variant={"contained"} fullWidth>Search</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography gutterBottom color={"#fff"}>empty</Typography>
                        <Button variant={"text"} color={"error"} onClick={() => handleClearFilter()}>Clear
                            filter</Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
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
                             width: "50px",
                             display: "block"
                         }}/>
                );
            }
        },
        {
            field: 'productName',
            headerName: 'Name',
            flex: 0.7,
            renderCell(params: GridCellParams) {

                return (
                    <Typography className={"productName"}>{params.row.productName}</Typography>
                );
            }
        },
        {
            field: 'sku',
            headerName: 'SKU',
            flex: 0.3,
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
            field: 'totalSold',
            headerName: 'Purchased',
            flex: 0.35
        },
        {
            field: 'quantityInStock',
            headerName: 'Stock',
            flex: 0.3
        },
        {
            field: 'productType',
            headerName: 'Type',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                let productStatus: ProductType = params.row.productType;
                let chipBgColor = null;
                let chipTextColor = "#212121";
                switch (productStatus) {
                    case ProductType.NORMAL: {
                        chipBgColor = "#ff7a45";
                        chipTextColor = "#fff";
                        break;
                    }
                    case ProductType.VOUCHER: {
                        chipBgColor = "#4096ff";
                        chipTextColor = "#fff";
                        break;
                    }
                    case ProductType.BILL: {
                        chipBgColor = "#73d13d";
                        chipTextColor = "#fff";
                        break;
                    }
                    default: {
                        break;
                    }
                }

                /*TODO: use lan en vn*/
                return (
                    <Chip label={params.row.productTypeDescription} size={"small"}
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
            field: 'pointExchange',
            headerName: 'Point Exchange',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                /*TODO: use lan en vn*/
                return (
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                        {
                            params.row.exchangeAblePoints.map((productPoint, index) => (
                                <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                    <Typography>{productPoint.pointExchange}</Typography>
                                    <Tooltip title={productPoint.enterprise.enterpriseName} key={index}>
                                        <Avatar alt="img"
                                                src={AssetPath.enterpriseLogoUrl + productPoint.enterprise.logoUrl}
                                                sx={{width: 15, height: 15}}/>
                                    </Tooltip>
                                </Box>

                            ))
                        }
                    </Box>
                );
            }
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
                    <Chip label={params.row.productStatusDescription} size={"small"}
                          style={{backgroundColor: chipBgColor, color: chipTextColor}}/>
                );
            }
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
                    onClick={() => history.push(AdminRouter.productCollectionPage + "/" + createSeoLink(params.row.productName) + "." + params.id)}
                />,
                <GridActionsCellItem
                    label="Edit"
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
                disableRowSelectionOnClick
                slots={{
                    toolbar: GridToolbar,
                }}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                            inputDate: false,
                            expirationDate: false,
                            productStatus: false,
                        },
                    },
                }}
                getRowHeight={() => 'auto'}
                sx={{
                    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {py: '8px'},
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {py: '15px'},
                    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {py: '22px'},
                }}
            />
        </Box>
    )
}


const AdminProductCollectionPage: React.FC<Props> = ({}) => {

    const [products, setProducts] = useState<Product[]>();
    const [childCatalogs, setChildCatalogs] = useState<Catalog[]>([]);
    const [enterpriseFilters, setEnterpriseFilters] = useState<AbstractFilter[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);

    useEffect(() => {
        getProductByCriteria({}).then((resProducts: Product[]) => {
            setProducts(resProducts);
            getAllMainCatalog()
                .then((resCatalogs: Catalog[]) => {
                    let items: Catalog[] = resCatalogs.filter(x => x.childCatalogs.length > 0).flatMap(x => x.childCatalogs);
                    setChildCatalogs(items);
                    getAllEnterprise()
                        .then((resEnterprises: Enterprise[]) => {
                            let items: AbstractFilter[] = [];
                            resEnterprises.forEach((resEnterprise, index) => {
                                items.push({
                                    label: resEnterprise.enterpriseName,
                                    value: resEnterprise.id
                                })
                            });
                            setEnterpriseFilters([...items]);
                        }).finally(() => {
                        setIsShow(true);
                    })
                }).catch((err: ExceptionResponse) => {
                console.log(err);
            })
        }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
    }, []);

    /*TODO: handle search*/
    const handleSearchProduct = async (criteria: ProductSearchCriteriaRequest) => {
        getProductByCriteria(formatCriteria(criteria))
            .then((resProducts: Product[]) => setProducts(resProducts))
            .catch((err: ExceptionResponse) => console.log(err));
    }

    const formatCriteria = (criteria: ProductSearchCriteriaRequest) => {
        if (criteria.productType == ProductType.ALL) {
            criteria.productType = null;
        }
        if (criteria.productStatus == ProductStatus.ALL) {
            criteria.productStatus = null;
        }
        return criteria;
    }

    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Product"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <ProductSearch childCatalogs={childCatalogs} enterpriseFilters={enterpriseFilters}
                                   onSearchProduct={(criteria: ProductSearchCriteriaRequest) => handleSearchProduct(criteria)}/>
                </Box>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <ProductList products={products}/>
                </Box>
            </Stack>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminProductCollectionPage;