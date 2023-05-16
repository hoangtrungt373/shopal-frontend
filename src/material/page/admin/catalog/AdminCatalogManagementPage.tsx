import * as React from "react";
import {useEffect, useState} from "react";
import {Autocomplete, Box, Chip, MenuItem, Stack} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import PageHeader from "../../common/share/PageHeader";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {useForm} from "react-hook-form";
import {AdminCreateOrUpdateCatalogRequest} from "../../../model/request/AdminCreateOrUpdateCatalogRequest";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Catalog} from "../../../model/Catalog";
import {getAllChildCatalog, getAllMainCatalogWithDetail} from "../../../service/catalog.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {useHistory} from "react-router-dom";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import {ProductTrendingState} from "../../../model/enums/ProductTrendingState";
import './admincatalogmanagementpage.css';
import {AssetPath} from "../../../config/router";
import IconButton from "@mui/material/IconButton";
import ImageSearchOutlinedIcon from "@mui/icons-material/ImageSearchOutlined";
import {CatalogStatus} from "../../../model/enums/CatalogStatus";

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Main Category",
        isLasted: true
    }
]

interface Props {
    catalogs: Catalog[],
    onCLickDetail: Function
}

interface CatalogStatusOption {
    label: string,
    value: CatalogStatus
}

const MainCatalogList: React.FC<Props> = ({catalogs, onCLickDetail}) => {

    const history = useHistory();

    /*TODO: implement pagination*/
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.3
        },
        {
            field: 'logoUrl',
            headerName: 'Thumb',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                return (
                    <img src={`${AssetPath.catalogLogoUrl}${params.row.logoUrl}`} alt={"img"}
                         style={{
                             width: "40px",
                             display: "block"
                         }}/>
                );
            }
        },
        {
            field: 'catalogName',
            headerName: 'Name',
            flex: 0.7
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
                rows={catalogs}
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

const addNew = "Add Category";

const AdminCatalogManagementPage: React.FC<Props> = ({}) => {

    /*TODO: handle add and edit*/
    const [mainCatalogs, setMainCatalogs] = useState<Catalog[]>();
    const [childCatalogs, setChildCatalogs] = useState<Catalog[]>([]);
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
    const [selectedCatalogs, setSelectedCatalogs] = useState<Catalog[]>([]);
    const [imgUrl, setImgUrl] = useState<any>();

    const catalogRequestDefaultValue: AdminCreateOrUpdateCatalogRequest = {
        catalogId: null,
        catalogName: null,
        catalogStatus: CatalogStatus.ACTIVE,
        logoUrl: null,
        parentCatalogId: null,
        level: null,
        childCatalogs: []
    };
    const [catalogRequest, setCatalogRequest] = useState<AdminCreateOrUpdateCatalogRequest>(catalogRequestDefaultValue);


    useEffect(() => {
        getAllMainCatalogWithDetail()
            .then((resCatalogs: Catalog[]) => {
                setMainCatalogs(resCatalogs);
                getAllChildCatalog()
                    .then((resChildCatalogs: Catalog[]) => {
                        setChildCatalogs(resChildCatalogs);
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
        let selectedCatalog = mainCatalogs.find(x => x.id == id);
        setValue("catalogId", selectedCatalog.id);
        setValue("catalogName", selectedCatalog.catalogName);
        setCatalogRequest(prevState1 => ({
            ...prevState1,
            catalogStatus: selectedCatalog.catalogStatus,
        }));
        setCatalogRequest(catalogRequestDefaultValue);
        setImgUrl(selectedCatalog.logoUrl);
        setTitleForm(selectedCatalog.catalogName);
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

    const handleChangeSelectedCatalogs = (e, value) => {
        setSelectedCatalogs([...value])
    }

    /*TODO: handle upload img*/
    const handleSetImg = (e) => {
        setImgUrl(e.target.files[0].name);
    }

    /*TODO: reset catalogstatus to ACTIVE*/
    const resetForm = () => {
        reset();
        setCatalogRequest(catalogRequestDefaultValue);
        setSelectedCatalogs([]);
        setImgUrl(undefined);
        setTitleForm(addNew);
    }

    if (isShow) {
        return (
            <Stack spacing={2} className={"admin-catalog-management-page"}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Main Category"}/>
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
                                    <Typography gutterBottom fontWeight={"bold"}>Logo</Typography>
                                    <Box sx={{
                                        border: "1px solid #EEEEEE",
                                        borderRadius: 2,
                                        padding: 2,
                                        position: "relative"
                                    }}>
                                        <img
                                            src={imgUrl !== undefined ? AssetPath.catalogLogoUrl + imgUrl : AssetPath.productUploadPreviewImg}
                                            alt={"img"}
                                            style={{
                                                borderRadius: 5,
                                                width: "100%",
                                                height: "100%",
                                                margin: "auto",
                                                display: "block"
                                            }}/>
                                        <IconButton color="primary" style={{position: "absolute", right: 5, top: 5}}
                                                    disableRipple={true}
                                                    size={"large"} aria-label="upload picture"
                                                    component="label">
                                            <input hidden accept="image/*" type="file"
                                                   onChange={handleSetImg}/>
                                            <ImageSearchOutlinedIcon/>
                                        </IconButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography gutterBottom fontWeight={"bold"}>Status</Typography>
                                    <TextField
                                        select
                                        // defaultValue={CatalogStatus.ACTIVE}
                                        value={catalogRequest.catalogStatus}
                                        onChange={e => {
                                            setCatalogRequest(prevState1 => ({
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
                                    <Typography gutterBottom fontWeight={"bold"}>Sub Categories</Typography>
                                    <Autocomplete
                                        multiple
                                        options={childCatalogs}
                                        value={selectedCatalogs}
                                        getOptionLabel={(childCatalog) => childCatalog.catalogName}
                                        sx={{width: "100%"}}
                                        onChange={handleChangeSelectedCatalogs}
                                        renderInput={(params) => <TextField {...params}
                                                                            size={"small"}/>}
                                    />
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
                        <MainCatalogList catalogs={mainCatalogs} onCLickDetail={(id: number) => handleClickDetail(id)}/>
                    </Box>
                </Stack>
            </Stack>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminCatalogManagementPage