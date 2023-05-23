import * as React from "react";
import {useEffect, useState} from "react";
import {Alert, Autocomplete, Box, MenuItem, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import PageSpinner from "../../common/share/PageSpinner";
import {useForm} from "react-hook-form";
import {AdminCreateOrUpdateProductRequest} from "../../../model/request/AdminCreateOrUpdateProductRequest";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {Catalog} from "../../../model/Catalog";
import {getAllMainCatalog} from "../../../service/catalog.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import Grid from "@mui/material/Grid";
import './AdminCreateOrUpdateProductPage.scss'
import {AdminRouter, AssetPath} from "../../../config/router";
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import IconButton from "@mui/material/IconButton";
import AlertDialog from "../../common/share/AlertDialog";
import {useHistory} from "react-router-dom";
import '../Admin.scss'
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import PageHeader from "../../common/share/PageHeader";
import {CatalogStatus} from "../../../model/enums/CatalogStatus";
import {GroupHeader} from "../../../model/common/GroupHeader";
import {GroupItems} from "../../../model/common/GroupItem";
import {ProductType} from "../../../model/enums/ProductType";
import {createOrUpdateProduct} from "../../../service/product.service";
import {ProductStatus} from "../../../model/enums/ProductStatus";
import {createSeoLink} from "../../../util/display.util";
import {CreateOrUpdateProductResponse} from "../../../model/admin/CreateOrUpdateProductResponse";

const breadCrumbItems: BreadcrumbItem[] = [
    {
        url: AdminRouter.productCollectionPage,
        title: "Product"
    },
    {
        title: "New",
        isLasted: true
    }
]

interface Props {
}

interface ProductStatusOption {
    label: string,
    value: CatalogStatus
}

interface ProductTypeOption {
    label: string,
    value: ProductType
}

interface Alert {
    open: boolean,
    content: any
}


const AdminCreateOrUpdateProductPage: React.FC<Props> = ({}) => {

    const history = useHistory();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [childCatalogs, setChildCatalogs] = useState<Catalog[]>([]);
    /*TODO: handle upload and save image*/
    const [imgUrls, setImgUrls] = useState<any[]>([]);
    const [showError, setShowError] = useState<Alert>({open: false, content: null});
    /*TODO: add content for product*/
    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "Create new product succefully",
        acceptText: "Create another",
        handleAccept: null,
        deniedText: "Return to dashboard",
        handleDenied: null,
    });
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<AdminCreateOrUpdateProductRequest>();

    useEffect(() => {
        getAllMainCatalog()
            .then((resCatalogs: Catalog[]) => {
                let childCatalogs: Catalog[] = resCatalogs.filter(x => x.childCatalogs.length > 0).flatMap(x => x.childCatalogs);
                setChildCatalogs(childCatalogs);
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
            .finally(() => {
                setIsShow(true);
            })
    }, []);

    const onSubmit = handleSubmit(data => {
        let reqImgUrls: any[] = [...imgUrls.filter(x => x != undefined)];
        if (reqImgUrls.length == 0) {
            return;
        } else {
            let request: AdminCreateOrUpdateProductRequest = {
                productId: null,
                productName: data.productName,
                sku: data.sku,
                quantityInStock: data.quantityInStock,
                expirationDate: data.expirationDate,
                initialCash: data.initialCash,
                catalogId: childCatalogs.find(x => x.catalogName == data.catalogName).id,
                files: [...reqImgUrls],
                productStatus: data.productStatus,
                productType: data.productType
            }
            createOrUpdateProduct(request)
                .then((res: CreateOrUpdateProductResponse) => {
                    setShowAlert(prevState1 => ({
                        ...prevState1,
                        open: true,
                        handleAccept: () => {
                            reset();
                            setImgUrls([]);
                            setShowAlert(prevState2 => ({
                                ...prevState2,
                                open: false,
                            }));
                        },
                        handleDenied: () => history.push(AdminRouter.productCollectionPage + "/" + createSeoLink(request.productName) + "." + res.productId),
                    }));
                    setShowError({
                        open: false,
                        content: null
                    })
                }).catch((err: ExceptionResponse) => {
                if (err.status == 409) {
                    setShowError({
                        open: true,
                        content: err.errorMessage
                    })
                } else {
                    console.log(err);
                }
            })
        }
    });

    /*TODO: handle autocomplete with react hook form*/
    const handleCatalogOptionSelect = (event, newValue) => {
        setValue("catalogId", newValue.id);
    };

    const handleSetImg = (e, pos) => {
        let newImgUrls = [...imgUrls];
        newImgUrls[pos] = e.target.files[0];
        setImgUrls([...newImgUrls]);
    }

    const productStatusList: ProductStatusOption[] = [
        {
            label: "Active",
            value: CatalogStatus.ACTIVE
        },
        {
            label: "Inactive",
            value: CatalogStatus.INACTIVE
        }
    ];

    const productTypeList: ProductTypeOption[] = [
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
        }
    ];

    const DisplayAlert = () => {
        if (showAlert.open) {
            return (
                <AlertDialog
                    acceptText={showAlert.acceptText} isShowAcceptBtn={true} isShowDeniedBtn={true}
                    deniedText={showAlert.deniedText}
                    handleAccept={showAlert.handleAccept} handleDenied={showAlert.handleDenied}
                    isOpen={showAlert.open} title={showAlert.title}/>
            )
        } else {
            return null;
        }
    }

    if (isShow) {
        return (
            <Stack spacing={2}>
                <DisplayAlert/>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Add Product"}/>
                <Box className={"content-box"} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    <Typography className={"page-sub-header"}>Add Product</Typography>
                    <Divider style={{marginLeft: "-16px", marginRight: "-16px"}}/>
                    <form onSubmit={onSubmit}>
                        <Stack
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem/>}
                            spacing={2}>
                            <Box sx={{
                                width: "35%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2
                            }}>
                                <Box sx={{
                                    border: "1px solid #EEEEEE",
                                    borderRadius: 2,
                                    padding: 2,
                                    position: "relative"
                                }}>
                                    <img
                                        src={imgUrls[0] !== undefined ? URL.createObjectURL(imgUrls[0]) : AssetPath.productUploadPreviewImg}
                                        alt={"img"}
                                        style={{borderRadius: 5, width: "100%", margin: "auto", display: "block"}}/>
                                    <IconButton color="primary" style={{position: "absolute", right: 10, top: 10}}
                                                disableRipple={true}
                                                size={"large"} aria-label="upload picture"
                                                component="label">
                                        <input hidden accept="image/*" type="file"
                                               onChange={(e) => handleSetImg(e, 0)}/>
                                        <ImageSearchOutlinedIcon/>
                                    </IconButton>
                                </Box>
                                <Box sx={{px: 4}}>
                                    <Grid container spacing={2}>
                                        {
                                            [1, 2, 3, 4, 5, 6].map((number, index) => (
                                                <Grid item xs={4} key={index}>
                                                    <Box sx={{
                                                        border: "1px solid #EEEEEE",
                                                        borderRadius: 2,
                                                        padding: 0.5,
                                                        position: "relative"
                                                    }}>
                                                        <img
                                                            src={imgUrls[number] !== undefined ? URL.createObjectURL(imgUrls[number]) : AssetPath.productUploadPreviewImg}
                                                            alt={"img"}
                                                            style={{
                                                                borderRadius: 5,
                                                                width: "100%",
                                                                margin: "auto",
                                                                display: "block"
                                                            }}/>
                                                        <IconButton color="primary" disableRipple={true}
                                                                    style={{position: "absolute", right: 2, top: 2}}
                                                                    aria-label="upload picture"
                                                                    component="label"
                                                                    size={"small"}>
                                                            <input hidden accept="image/*" type="file"
                                                                   onChange={(e) => handleSetImg(e, number)}/>
                                                            <ImageSearchOutlinedIcon/>
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                            ))
                                        }
                                    </Grid>
                                </Box>
                            </Box>
                            <Box sx={{
                                width: "65%",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography gutterBottom fontWeight={"bold"}>PRODUCT NAME</Typography>
                                        <TextField {...register("productName", {required: true})} fullWidth multiline
                                                   maxRows={4}
                                                   error={!!errors.productName}/>
                                        {errors.productName &&
                                            <span style={{color: "#EE4D2D"}}>Product Name is required</span>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom fontWeight={"bold"}>SELECT CATEGORIES</Typography>
                                        <Autocomplete
                                            id="grouped-demo"
                                            options={childCatalogs}
                                            groupBy={(catalog) => catalog.parentCatalogName}
                                            getOptionLabel={(catalog) => catalog.catalogName}

                                            sx={{width: "100%"}}
                                            renderInput={(params) => <TextField {...params}
                                                                                size={"small"} {...register("catalogName", {required: true})}
                                                                                error={!!errors.catalogName}/>}
                                            renderGroup={(params) => (
                                                <li key={params.key}>
                                                    <GroupHeader>{params.group}</GroupHeader>
                                                    <GroupItems>{params.children}</GroupItems>
                                                </li>
                                            )}
                                        />
                                        {errors.catalogName &&
                                            <span style={{color: "#EE4D2D"}}>At least 1 category is required</span>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom fontWeight={"bold"}>INITIAL CASH (VND)</Typography>
                                        <TextField {...register("initialCash", {required: true})} size={"small"}
                                                   fullWidth
                                                   type="number"
                                                   error={!!errors.initialCash}/>
                                        {errors.initialCash &&
                                            <span style={{color: "#EE4D2D"}}>Initial Cash is required</span>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom fontWeight={"bold"}>SKU</Typography>
                                        <TextField {...register("sku")} size={"small"} fullWidth/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom fontWeight={"bold"}>QUANTITY</Typography>
                                        <TextField {...register("quantityInStock", {required: true})} size={"small"}
                                                   type={"number"}
                                                   fullWidth error={!!errors.quantityInStock}/>
                                        {errors.quantityInStock &&
                                            <span style={{color: "#EE4D2D"}}>Quantity is required</span>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom fontWeight={"bold"}>EXPIRATION DATE</Typography>
                                        <TextField {...register("expirationDate")} size={"small"} fullWidth
                                                   type={"date"}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom fontWeight={"bold"}>STATUS</Typography>
                                        <TextField
                                            select
                                            defaultValue={ProductStatus.ACTIVE}
                                            {...register("productStatus")} size={"small"}
                                            sx={{width: "100%"}}
                                        >
                                            {productStatusList.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom fontWeight={"bold"}>TYPE</Typography>
                                        <TextField
                                            select
                                            defaultValue={ProductType.NORMAL}
                                            {...register("productType")} size={"small"}
                                            sx={{width: "100%"}}
                                        >
                                            {productTypeList.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Button type={"submit"} variant={"contained"} onClick={() => {
                                    if (!imgUrls.find(x => x != undefined)) {
                                        setShowError({
                                            open: true,
                                            content: "At least one image is selected!"
                                        })
                                    } else {
                                        setShowError({
                                            open: false,
                                            content: ""
                                        });
                                    }
                                }}>Submit</Button>
                                {
                                    showError.open && (
                                        <Alert severity="error">{showError.content}</Alert>
                                    )
                                }
                            </Box>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminCreateOrUpdateProductPage;