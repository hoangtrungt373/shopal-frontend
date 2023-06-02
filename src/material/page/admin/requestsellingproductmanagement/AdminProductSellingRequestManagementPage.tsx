import * as React from "react";
import {useEffect, useState} from "react";
import {Alert, Box, Chip, Grid, Stack, Tooltip} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {useForm} from "react-hook-form";
import {
    getAllEnterpriseProductSellingRequestAnn,
    handleAcceptRequestSellingProduct
} from "../../../service/product.service";
import {Enterprise} from "../../../model/Enterprise";
import {EnterpriseProductSellingRequestAnn} from "../../../model/admin/EnterpriseProductSellingRequestAnn";
import {EnterpriseProductSellingRequestStatus} from "../../../model/enums/EnterpriseProductSellingRequestStatus";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import {AdminRouter, AssetPath} from "../../../config/router";
import Typography from "@mui/material/Typography";
import {createSeoLink, formatDateTime, formatVndMoney} from "../../../util/display.util";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";


interface Props {
    requests: EnterpriseProductSellingRequestAnn[],
    onClickDetail?: Function,
    enterprise?: Enterprise
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Product selling request",
        isLasted: true
    }
]

interface ChipStyle {
    chipBgColor: string,
    chipTextColor: string,
}

export const getChipStyleEnterpriseProductSellingRequestStatus = (status: EnterpriseProductSellingRequestStatus) => {
    let chipBgColor = "#8A909D";
    let chipTextColor = "#212121";
    switch (status) {
        case EnterpriseProductSellingRequestStatus.RECEIVED: {
            chipBgColor = "#8A909D";
            chipTextColor = "#fff";
            break;
        }
        case EnterpriseProductSellingRequestStatus.ACCEPT: {
            chipBgColor = "#13CAE1";
            chipTextColor = "#fff";
            break;
        }
        case EnterpriseProductSellingRequestStatus.REFUSE: {
            chipBgColor = "#F44336";
            break;
        }
        default: {
            break;
        }
    }
    return {
        chipBgColor,
        chipTextColor
    }
}

const AdminProductSellingRequestManagementPage: React.FC<Props> = ({}) => {

    const [sellingRequests, setSellingRequests] = useState<EnterpriseProductSellingRequestAnn[]>()
    const [isShow, setIsShow] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<EnterpriseProductSellingRequestAnn>();
    const [showAlert, setShowAlert] = useState({
        open: false,
        content: "success",
        severity: "test"
    });
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        getValues,
        formState: {errors}
    } = useForm<EnterpriseProductSellingRequestAnn>();

    useEffect(() => {
        getAllEnterpriseProductSellingRequestAnn()
            .then((resRequests: EnterpriseProductSellingRequestAnn[]) => {
                setSellingRequests(resRequests);
                if (resRequests.length > 0) {
                    setSelectedRequest(resRequests[0]);
                    setFormValue(resRequests[0]);
                }
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        }).finally(() => {
            setIsShow(true);
        })
        document.title = "Admin - Product Selling Requests";
    }, []);

    const handleClickDetail = (requestId: number) => {
        let newSelectedRequest = sellingRequests.find(x => x.id == requestId);
        setSelectedRequest(newSelectedRequest);
        setFormValue(newSelectedRequest);
    }

    const setFormValue = (request: EnterpriseProductSellingRequestAnn) => {
        setValue("cashPerPoint", request.cashPerPoint);
        setValue("enterpriseProductSellingRequestStatus", request.enterpriseProductSellingRequestStatus);
    }

    const handleAccept = (id: number) => {
        let selectedItem: EnterpriseProductSellingRequestAnn = sellingRequests.find(x => x.id == id);

        handleAcceptRequestSellingProduct(selectedItem)
            .then((res: string) => {

                let updateSellingRequests = [...sellingRequests];
                updateSellingRequests.find(x => x.id == selectedItem.id).enterpriseProductSellingRequestStatus = EnterpriseProductSellingRequestStatus.ACCEPT;
                setSellingRequests([...updateSellingRequests])

                setShowAlert(prevState4 => ({
                    ...prevState4,
                    open: true,
                    content: res,
                    severity: "success"
                }));
            }).catch((err: ExceptionResponse) => {
            if (err.status == 409) {
                setShowAlert(prevState4 => ({
                    ...prevState4,
                    open: true,
                    content: err.errorMessage,
                    severity: "error"
                }));
            }
        })
    };


    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Product selling request"}/>
                <Stack spacing={2}>
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}
                         className={"content-box"}>
                        {
                            showAlert.open && (
                                <Grid item xs={12}>
                                    <Alert severity={"success"}>{showAlert.content}</Alert>
                                </Grid>
                            )
                        }
                        <Grid container spacing={2}>
                            {
                                sellingRequests.map((sellingRequest, index) => (
                                    <Grid item xs={6}>
                                        <Stack spacing={2} divider={<Divider flexItem/>} style={{
                                            padding: "16px",
                                            borderRadius: "8px",
                                            border: "1px solid var(--neutralgray-400)"
                                        }}>
                                            <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                                                <Chip label={sellingRequest.enterpriseProductSellingRequestStatus}
                                                      size={"small"}
                                                      style={{
                                                          backgroundColor: getChipStyleEnterpriseProductSellingRequestStatus(selectedRequest.enterpriseProductSellingRequestStatus).chipBgColor,
                                                          color: getChipStyleEnterpriseProductSellingRequestStatus(selectedRequest.enterpriseProductSellingRequestStatus).chipTextColor
                                                      }}/>
                                                <Tooltip title={sellingRequest.enterprise.enterpriseName} key={index}>
                                                    <Avatar alt="img"
                                                            src={AssetPath.enterpriseLogoUrl + sellingRequest.enterprise.logoUrl}
                                                            sx={{width: 30, height: 30}}/>
                                                </Tooltip>
                                                <Typography fontSize={"18px"}
                                                            fontWeight={"bold"}>{sellingRequest.enterprise.enterpriseName}</Typography>
                                                <Typography style={{
                                                    marginLeft: "auto",
                                                    textAlign: "center"
                                                }}>{formatDateTime(sellingRequest.date)}</Typography>
                                            </Box>
                                            <Box sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 2
                                            }}>
                                                <img src={AssetPath.productImgUrl + sellingRequest.product.mainImgUrl}
                                                     style={{width: "100px", height: "100px"}}/>
                                                <Box style={{display: "flex", flexDirection: "column", gap: "8px"}}
                                                     className={"product-card"}>
                                                    <Box sx={{height: "32px"}}>
                                                        <Link className={"product-cart-name"} style={{width: "100%"}}
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                              to={AdminRouter.productDetailPage + "/" + createSeoLink(sellingRequest.product.productName) + "." + sellingRequest.product.id}
                                                        >{sellingRequest.product.productName}</Link>
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            fontWeight={"bold"}>{formatVndMoney(sellingRequest.product.initialCash)}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography>Cash Per
                                                            Point: {sellingRequest.cashPerPoint}</Typography>
                                                    </Box>
                                                    <Box sx={{
                                                        display: "flex",
                                                        gap: 0.5,
                                                        alignItems: "center"
                                                    }}>
                                                        <Typography>Point
                                                            Exchange: {Math.round((sellingRequest.product.initialCash / sellingRequest.cashPerPoint))}</Typography>
                                                        <Tooltip
                                                            title={sellingRequest.enterprise.enterpriseName}>
                                                            <Avatar alt="img"
                                                                    src={AssetPath.enterpriseLogoUrl + sellingRequest.enterprise.logoUrl}
                                                                    sx={{width: 15, height: 15}}/>
                                                        </Tooltip>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Button onClick={() => handleAccept(sellingRequest.id)}
                                                                variant={"contained"} fullWidth
                                                                color={sellingRequest.enterpriseProductSellingRequestStatus == EnterpriseProductSellingRequestStatus.RECEIVED ? "primary" : "success"}
                                                                disabled={sellingRequest.enterpriseProductSellingRequestStatus == EnterpriseProductSellingRequestStatus.ACCEPT}
                                                        >{sellingRequest.enterpriseProductSellingRequestStatus == EnterpriseProductSellingRequestStatus.RECEIVED ? "Accept" : "Accepted"}</Button>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Button variant={"outlined"} fullWidth
                                                                disabled={sellingRequest.enterpriseProductSellingRequestStatus == EnterpriseProductSellingRequestStatus.ACCEPT}
                                                        >Refuse</Button>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                </Stack>
            </Stack>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminProductSellingRequestManagementPage;