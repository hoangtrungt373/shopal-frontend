import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Chip, MenuItem, Stack} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import AdminPageHeader from "../../common/admin/AdminPageHeader";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {useForm} from "react-hook-form";
import {AdminCreateOrUpdateCatalogRequest} from "../../../model/request/AdminCreateOrUpdateCatalogRequest";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Catalog} from "../../../model/Catalog";
import {getAllChildCatalogWithDetail, getAllMainCatalog} from "../../../service/catalog.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {useHistory} from "react-router-dom";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import {ProductTrendingState} from "../../../model/enums/ProductTrendingState";
import './adminchildcatalogmanagementpage.css';
import {CatalogStatus} from "../../../model/enums/CatalogStatus";

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Sub Category",
        isLasted: true
    }
]

interface Props {
    childCatalogs: Catalog[],
    onCLickDetail: Function,
}

interface CatalogStatusOption {
    label: string,
    value: CatalogStatus
}

const MainCatalogList: React.FC<Props> = ({childCatalogs, onCLickDetail}) => {

    const history = useHistory();

    /*TODO: implement pagination*/
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.3
        },
        {
            field: 'catalogName',
            headerName: 'Name',
            flex: 0.7
        },
        {
            field: 'parentCatalogName',
            headerName: 'Main Category',
            flex: 0.7,
            renderCell(params: GridCellParams) {

                return (
                    <Chip label={params.row.parentCatalogName} size={"small"}/>
                );
            }
        },
        {
            field: 'totalProduct',
            headerName: 'Product',
            flex: 0.3
        },
        {
            field: 'totalSell',
            headerName: 'Total Sell',
            flex: 0.3
        },
        {
            field: 'catalogStatus',
            headerName: 'Status',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                let catalogStatus: CatalogStatus = params.row.catalogStatus;
                let chipBgColor = null;
                let chipTextColor = "#212121";
                switch (catalogStatus) {
                    case CatalogStatus.INACTIVE: {
                        chipBgColor = "#8A909D";
                        chipTextColor = "#fff";
                        break;
                    }
                    case CatalogStatus.ACTIVE: {
                        chipBgColor = "#29CC97";
                        chipTextColor = "#fff";
                        break;
                    }
                    default: {
                        break;
                    }
                }

                return (
                    <Chip label={params.row.catalogStatusDescription} size={"small"}
                          style={{backgroundColor: chipBgColor, color: chipTextColor}}/>
                );
            }
        },
        {
            field: 'productTrendingState',
            headerName: 'Trending',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                let trending: ProductTrendingState = params.row.productTrendingState;
                let chipBgColor = null;
                let chipTextColor = "#212121";
                switch (trending) {
                    case ProductTrendingState.TOP: {
                        chipBgColor = "#29CC97";
                        chipTextColor = "#fff";
                        break;
                    }
                    case ProductTrendingState.MEDIUM: {
                        chipBgColor = "#88AAF3";
                        break;
                    }
                    case ProductTrendingState.LOW: {
                        chipBgColor = "#EC4A58";
                        chipTextColor = "#fff";
                        break;
                    }
                    default: {
                        break;
                    }
                }

                return (
                    <Chip label={params.row.productTrendingState} size={"small"}
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
                    label="Edit"
                    showInMenu
                />,
                <GridActionsCellItem
                    label="Detail"
                    showInMenu
                    onClick={() => onCLickDetail(params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={childCatalogs}
                columns={columns}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                }}
                checkboxSelectionVisibleOnly={true}
            />
        </Box>
    )
}

const addNew = "Add Sub Category";

const AdminChildCatalogManagementPage: React.FC<Props> = ({}) => {


    /*TODO: handle add and edit*/
    const [childCatalogs, setChildCatalogs] = useState<Catalog[]>();
    const [mainCatalogs, setMainCatalogs] = useState<Catalog[]>();
    const [titleForm, setTitleForm] = useState<string>(addNew);
    const [isShow, setIsShow] = useState<boolean>(false);
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        getValues,
        formState: {errors}
    } = useForm<AdminCreateOrUpdateCatalogRequest>();
    const [imgUrl, setImgUrl] = useState<any>();

    const subCatalogRequestDefaultValue: AdminCreateOrUpdateCatalogRequest = {
        catalogId: null,
        catalogName: null,
        catalogStatus: CatalogStatus.ACTIVE,
        logoUrl: null,
        parentCatalogId: null,
        level: null,
        childCatalogs: []
    };
    const [subCatalogRequest, setSubCatalogRequest] = useState<AdminCreateOrUpdateCatalogRequest>(subCatalogRequestDefaultValue);


    useEffect(() => {
        getAllChildCatalogWithDetail()
            .then((resChildCatalogs: Catalog[]) => {
                setChildCatalogs(resChildCatalogs);
                getAllMainCatalog()
                    .then((resMainCatalogs: Catalog[]) => {
                        console.log(resMainCatalogs)
                        setMainCatalogs(resMainCatalogs);
                        setSubCatalogRequest(prevState1 => ({
                            ...prevState1,
                            parentCatalogId: resMainCatalogs[0].id
                        }));
                    }).catch((err: ExceptionResponse) => {
                    console.log(err);
                }).finally(() => {
                    setIsShow(true);
                })
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
    }, []);

    const onSubmit = handleSubmit(data => {
        console.log(data)
    });

    const handleClickDetail = (id: number) => {
        let selectedChildCatalog = childCatalogs.find(x => x.id == id);
        setValue("catalogId", selectedChildCatalog.id);
        setValue("catalogName", selectedChildCatalog.catalogName);
        // setValue("parentCatalogId", selectedChildCatalog.parentCatalogId);
        setSubCatalogRequest(prevState1 => ({
            ...prevState1,
            catalogStatus: selectedChildCatalog.catalogStatus,
            parentCatalogId: selectedChildCatalog.parentCatalogId
        }));
        setImgUrl(selectedChildCatalog.logoUrl);
        setTitleForm(selectedChildCatalog.catalogName);
    }

    const catalogStatusList: CatalogStatusOption[] = [
        {
            label: "Active",
            value: CatalogStatus.ACTIVE
        },
        {
            label: "Inactive",
            value: CatalogStatus.INACTIVE
        }
    ];

    /*TODO: reset catalogstatus to ACTIVE*/
    const resetForm = () => {
        reset();
        setSubCatalogRequest(prevState1 => ({
            ...prevState1,
            parentCatalogId: mainCatalogs[0].id
        }));
        setImgUrl(undefined);
        setTitleForm(addNew);
    }


    if (isShow) {
        return (
            <Box sx={{display: "flex", flexDirection: "column"}} className={"admin-catalog-management-page"}>
                <AdminPageHeader breadCrumbItems={breadCrumbItems} title={"Sub Category"}/>
                <Stack direction="row" spacing={2}>
                    <Box sx={{width: "35%", display: "flex", flexDirection: "column", gap: 2}}
                         className={"content-box"}>
                        <Typography className={"page-sub-header"}>{titleForm}</Typography>
                        <Divider/>
                        <form onSubmit={onSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography gutterBottom><strong>Name</strong></Typography>
                                    <TextField {...register("catalogName", {required: true})} size={"small"}
                                               fullWidth error={!!errors.catalogName}/>
                                    {errors.catalogName &&
                                        <span style={{color: "#EE4D2D"}}>Product type is required</span>}
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography gutterBottom fontWeight={"bold"}>Status</Typography>
                                    <TextField
                                        select
                                        // defaultValue={CatalogStatus.ACTIVE}
                                        value={subCatalogRequest.catalogStatus}
                                        onChange={e => {
                                            setSubCatalogRequest(prevState1 => ({
                                                ...prevState1,
                                                catalogStatus: e.target.value as CatalogStatus,
                                            }));
                                        }}
                                        size={"small"}
                                        sx={{width: "100%"}}
                                    >
                                        {catalogStatusList.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography gutterBottom fontWeight={"bold"}>Parent Category</Typography>
                                    <TextField
                                        select
                                        defaultValue={subCatalogRequest.parentCatalogId}
                                        value={subCatalogRequest.parentCatalogId}
                                        onChange={e => {
                                            setSubCatalogRequest(prevState1 => ({
                                                ...prevState1,
                                                parentCatalogId: Number.parseInt(e.target.value)
                                            }));
                                        }}
                                        size={"small"}
                                        sx={{width: "100%"}}
                                    >
                                        {mainCatalogs.map((option, index) => (
                                            <MenuItem key={index} value={option.id}>
                                                {option.catalogName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant={"outlined"} color="error" onClick={() => resetForm()}
                                            fullWidth>Cancel</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type={"submit"} variant={"contained"} fullWidth>Submit</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                    <Box sx={{width: "65%", display: "flex", flexDirection: "column", gap: 2}}
                         className={"content-box"}>
                        <MainCatalogList childCatalogs={childCatalogs}
                                         onCLickDetail={(id: number) => handleClickDetail(id)}/>
                    </Box>
                </Stack>
            </Box>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminChildCatalogManagementPage