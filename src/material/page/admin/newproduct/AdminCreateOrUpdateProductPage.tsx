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
import {useHistory, useParams} from "react-router-dom";
import '../Admin.scss'
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import PageHeader from "../../common/share/PageHeader";
import {GroupHeader} from "../../../model/common/GroupHeader";
import {GroupItems} from "../../../model/common/GroupItem";
import {ProductType} from "../../../model/enums/ProductType";
import {createOrUpdateProduct, getProductDetail} from "../../../service/product.service";
import {ProductStatus} from "../../../model/enums/ProductStatus";
import {createSeoLink} from "../../../util/display.util";
import {CreateOrUpdateProductResponse} from "../../../model/admin/CreateOrUpdateProductResponse";
import {isNotNull, isNull} from "../../../util/object.util";
import {productStatusOptions, productTypeOptions} from "../../../util/filter.util";
import {ProductDetail} from "../../../model/ProductDetail";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface Props {
}

interface RouteParams {
    productId: any;
}

interface Alert {
    open: boolean,
    content: any
}

interface ExistsImg {
    imgUrl: string,
    isChangeToUpload: boolean
}


const AdminCreateOrUpdateProductPage: React.FC<Props> = ({}) => {

    const params: RouteParams = useParams()
    const history = useHistory();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [childCatalogs, setChildCatalogs] = useState<Catalog[]>([]);
    const [showError, setShowError] = useState<Alert>({open: false, content: null});
    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "Create new product succefully",
        acceptText: "Create another",
        handleAccept: null,
        deniedText: "Return to dashboard",
        handleDenied: null,
    });
    const [breadCrumbItems, setBreadCrumbItems] = useState<BreadcrumbItem[]>([]);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // form field
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm<AdminCreateOrUpdateProductRequest>();
    const [uploadImgs, setUploadImgs] = useState<any[]>([]);
    const [selectedChildCatalog, setSelectedChildCatalog] = useState<Catalog>();
    const [selectedProductType, setSelectedProductType] = useState<ProductType>(ProductType.NORMAL);
    const [selectedProductStatus, setSelectedProductStatus] = useState<ProductStatus>(ProductStatus.ACTIVE);
    const [content, setContent] = useState<string>();
    const [productDetail, setProductDetail] = useState<ProductDetail>();

    useEffect(() => {
        getAllMainCatalog()
            .then((resCatalogs: Catalog[]) => {
                let newChildCatgalogs: Catalog[] = resCatalogs.filter(x => x.childCatalogs.length > 0).flatMap(x => x.childCatalogs);
                setChildCatalogs(newChildCatgalogs);
                setSelectedChildCatalog(newChildCatgalogs[0]);

                if (isNull(params.productId)) {
                    setBreadCrumbItems([
                        {
                            url: AdminRouter.productCollectionPage,
                            title: "Product",
                        },
                        {
                            title: "New",
                            isLasted: true
                        },
                    ]);
                    setIsShow(true);
                } else {
                    setIsEdit(true);
                    getProductDetail(params.productId)
                        .then((productDetailRes: ProductDetail) => {
                            setProductDetail(productDetailRes);
                            setBreadCrumbItems([
                                {
                                    url: AdminRouter.productCollectionPage,
                                    title: "Product",
                                },
                                {
                                    url: AdminRouter.productCollectionPage + "/" + createSeoLink(productDetailRes.productName + "." + productDetailRes.id),
                                    title: productDetailRes.productName
                                },
                                {
                                    title: "Edit",
                                    isLasted: true
                                },
                            ]);
                            setFormValue(productDetailRes, newChildCatgalogs);
                        }).catch((err: ExceptionResponse) => {
                        console.log(err);
                    }).finally(() => {
                        setIsShow(true);
                    })
                }
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
    }, []);

    const setFormValue = (product: ProductDetail, catalogs: Catalog[]) => {
        setValue("productName", product.productName);
        setValue("sku", product.sku);
        setValue("expirationDate", product.expirationDate);
        setValue("initialCash", product.initialCash);
        setValue("quantityInStock", product.quantityInStock);
        setSelectedProductType(product.productType);
        setSelectedProductStatus(product.productStatus);
        setSelectedChildCatalog(catalogs.find(x => x.id == product.catalogs[0].id));
        setUploadImgs([...product.files]);
        setContent(product.content);
    }

    const onSubmit = handleSubmit(data => {
        let reqImgUrls: any[] = [...uploadImgs.filter(x => isNotNull(x))];
        if (reqImgUrls.length == 0) {
            return;
        } else {
            let request: AdminCreateOrUpdateProductRequest = {
                productId: isEdit ? productDetail.id : null,
                productName: data.productName,
                sku: data.sku,
                quantityInStock: data.quantityInStock,
                expirationDate: data.expirationDate,
                initialCash: data.initialCash,
                catalogId: selectedChildCatalog.id,
                uploadImgUrls: [...reqImgUrls],
                productStatus: selectedProductStatus,
                productType: selectedProductType
            }
            createOrUpdateProduct(request)
                .then((res: CreateOrUpdateProductResponse) => {
                    setShowError({
                        open: false,
                        content: null
                    });
                    console.log(res);
                    // history.push(AdminRouter.productCollectionPage + "/" + createSeoLink(request.productName) + "." + res.productId)
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

    const handleSetImg = (e, pos) => {
        let newUploadImgs = [...uploadImgs];
        newUploadImgs[pos] = e.target.files[0];
        setUploadImgs([...newUploadImgs]);
    }

    const resetForm = () => {
        reset();
        setUploadImgs([]);
        setSelectedProductStatus(ProductStatus.ACTIVE);
        setSelectedProductType(ProductType.NORMAL);
        setSelectedChildCatalog(childCatalogs[0]);
    }

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

    const getImgUrl = (pos: number) => {
        return isNotNull(uploadImgs[pos]) ? URL.createObjectURL(uploadImgs[pos]) : AssetPath.productUploadPreviewImg
    }

    if (isShow) {
        return (
            <Stack spacing={2}>
                <DisplayAlert/>
                <PageHeader breadCrumbItems={breadCrumbItems} title={isEdit ? "Edit Product" : "Add Product"}/>
                <Box className={"content-box"} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                    <Typography
                        className={"page-sub-header"}>{isEdit ? "Product: #" + productDetail.id : "Add Product"}</Typography>
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
                                        src={getImgUrl(0)}
                                        alt={"img"}
                                        onError={(e) => {
                                            // @ts-ignore
                                            e.target.src = AssetPath.productUploadPreviewImg
                                        }}
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
                                                            src={getImgUrl(number)}
                                                            alt={"img"}
                                                            onError={(e) => {
                                                                // @ts-ignore
                                                                e.target.src = AssetPath.productUploadPreviewImg
                                                            }}
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
                                                   rows={3}
                                                   error={!!errors.productName}/>
                                        {errors.productName &&
                                            <span style={{color: "#EE4D2D"}}>Product Name is required</span>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography gutterBottom fontWeight={"bold"}>SELECT CATEGORIES</Typography>
                                        <Autocomplete
                                            id="grouped-demo"
                                            options={childCatalogs}
                                            groupBy={(childCatalog) => childCatalog.parentCatalogName}
                                            getOptionLabel={(childCatalog) => childCatalog.catalogName}
                                            value={selectedChildCatalog}
                                            sx={{width: "100%"}}
                                            onChange={(e, value) => setSelectedChildCatalog(value)}
                                            renderInput={(params) => <TextField {...params} size={"small"}/>}
                                            renderGroup={(params) => (
                                                <li key={params.key}>
                                                    <GroupHeader>{params.group}</GroupHeader>
                                                    <GroupItems>{params.children}</GroupItems>
                                                </li>
                                            )}
                                        />
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
                                            value={selectedProductStatus}
                                            onChange={(e) => setSelectedProductStatus(e.target.value as ProductStatus)}
                                            size={"small"}
                                            sx={{width: "100%"}}
                                        >
                                            {productStatusOptions.map((option) => (
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
                                            value={selectedProductType}
                                            onChange={(e) => setSelectedProductType(e.target.value as ProductType)}
                                            {...register("productType")} size={"small"}
                                            sx={{width: "100%"}}
                                        >
                                            {productTypeOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Button type={"submit"} variant={"contained"} onClick={() => {
                                    if (!uploadImgs.find(x => x != undefined)) {
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
                    <Divider style={{marginLeft: "-16px", marginRight: "-16px"}}/>
                    <Typography className={"page-sub-header"}>Product Description</Typography>
                    <CKEditor
                        // @ts-ignore
                        onInit={(editor) => {
                            // You can store the "editor" and use when it is needed.
                            // console.log("Editor is ready to use!", editor);
                            return
                            // You can store the "editor" and use when it is needed.
                            // console.log("Editor is ready to use!", editor);
                            editor.editing.view.change((writer) => {
                                writer.setStyle(
                                    "height",
                                    "500px",
                                    editor.editing.view.document.getRoot()
                                );
                            });
                        }}
                        editor={ClassicEditor}
                        data={content}
                        onChange={(event, editor) => {
                            setContent(editor.getData());
                        }}
                    />
                </Box>
            </Stack>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminCreateOrUpdateProductPage;