import * as React from "react";
import {useEffect, useState} from "react";
import {Alert, Box, Chip, Stack, Tooltip} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {Link, useHistory} from "react-router-dom";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import {CreateOrUpdateContractRequestAnn} from "../../../model/admin/CreateOrUpdateContractRequestAnn";
import {
    getAllCreateOrUpdateContractAnn,
    handleAcceptCreateOrUpdateContractRequest
} from "../../../service/contract.service";
import {ContractChangeRequestStatus} from "../../../model/enums/ContractChangeRequestStatus";
import {isNotNull} from "../../../util/object.util";
import {getProductByCriteria} from "../../../service/product.service";
import {Product} from "../../../model/Product";
import Avatar from "@mui/material/Avatar";
import {AdminRouter, AssetPath} from "../../../config/router";
import {createSeoLink, formatVndMoney} from "../../../util/display.util";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {Enterprise} from "../../../model/Enterprise";


interface Props {
    requests: CreateOrUpdateContractRequestAnn[],
    onClickDetail?: Function,
    enterprise?: Enterprise
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Contract request",
        isLasted: true
    }
]

interface ChipStyle {
    chipBgColor: string,
    chipTextColor: string,
}

const getChipStyle = (status: ContractChangeRequestStatus) => {
    let chipBgColor = null;
    let chipTextColor = "#212121";
    switch (status) {
        case ContractChangeRequestStatus.RECEIVED: {
            chipBgColor = "#8A909D";
            chipTextColor = "#fff";
            break;
        }
        case ContractChangeRequestStatus.ACCEPT: {
            chipBgColor = "#13CAE1";
            chipTextColor = "#fff";
            break;
        }
        case ContractChangeRequestStatus.REFUSE: {
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


const RequestList: React.FC<Props> = ({requests, onClickDetail}) => {

    const history = useHistory();

    /*TODO: implement pagination*/
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.3
        },
        {
            field: 'enterpriseName',
            headerName: 'Enterprise',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.enterprise.enterpriseName}</Typography>
                );
            }
        },
        {
            field: 'registerDate',
            headerName: 'Register Date',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.date.slice(0, 10)}</Typography>
                );
            }
        },
        {
            field: 'isEdit',
            headerName: 'Type',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.isEdit ? "Update" : "Create"}</Typography>
                );
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                let requestStatus: ContractChangeRequestStatus = params.row.contractChangeRequestStatus;
                let chipStyle: ChipStyle = getChipStyle(requestStatus);

                return (
                    <Chip label={params.row.contractChangeRequestStatus} size={"small"}
                          style={{backgroundColor: chipStyle.chipBgColor, color: chipStyle.chipTextColor}}/>
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
                    onClick={() => onClickDetail(params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={requests}
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

const ProductSellingList = ({products, oldCashPerPoint, updateCashPerPoint, enterprise}) => {

    const ProductPoint = ({point}) => {
        return (
            <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: 2
            }}>
                <Box sx={{
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center"
                }}>
                    <Typography fontWeight={"bold"}
                                color={"#FF424E"}>{point}</Typography>
                    <Tooltip
                        title={enterprise.enterpriseName}>
                        <Avatar alt="img"
                                src={AssetPath.enterpriseLogoUrl + enterprise.logoUrl}
                                sx={{width: 15, height: 15}}/>
                    </Tooltip>
                </Box>
            </Box>
        )
    }

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                {
                    products.map((product, index) => (
                        <Grid item xs={3}>
                            <Link
                                to={AdminRouter.productDetailPage + "/" + createSeoLink(product.productName) + "." + product.id}
                                key={index} style={{textDecoration: "none"}}>
                                <Stack direction={"row"} spacing={2} className={"cart-item"} p={1}
                                       alignItems={"center"}
                                       style={{
                                           border: "1px solid var(--neutralgray-500)",
                                           borderRadius: "8px"
                                       }}>
                                    <img src={AssetPath.productImgUrl + product.mainImgUrl}
                                         style={{width: "50px", height: "50px"}}/>
                                    <Box style={{display: "flex", flexDirection: "column", gap: "8px"}}
                                         className={"product-card"}>
                                        <Box sx={{height: "32px"}}>
                                            <Typography className={"product-name"}>{product.productName}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                fontWeight={"bold"}>{formatVndMoney(product.initialCash)}</Typography>
                                        </Box>
                                        {
                                            product.exchangeAblePoints.filter(x => x.enterprise.id == enterprise.id).map((productPoint, index) => (
                                                <Box sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1
                                                }}>
                                                    <ProductPoint
                                                        point={Math.round((product.initialCash / oldCashPerPoint))}/>
                                                    {
                                                        isNotNull(updateCashPerPoint) && (
                                                            <ArrowForwardIcon style={{
                                                                fontSize: "16px",
                                                                position: "relative",
                                                                bottom: 1
                                                            }}/>
                                                        )
                                                    }
                                                    {
                                                        isNotNull(updateCashPerPoint) && (
                                                            <ProductPoint
                                                                point={Math.round((product.initialCash / updateCashPerPoint))}/>
                                                        )
                                                    }
                                                </Box>
                                            ))
                                        }
                                    </Box>
                                </Stack>
                            </Link>
                        </Grid>
                    ))
                }
            </Grid>
        </React.Fragment>
    )
}

const AdminCooperationContractRequestManagementPage: React.FC<Props> = ({}) => {

    const [contractRequests, setContractRequests] = useState<CreateOrUpdateContractRequestAnn[]>()
    const [isShow, setIsShow] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<CreateOrUpdateContractRequestAnn>();
    const [products, setProducts] = useState<Product[]>();
    const [showAlert, setShowAlert] = useState({
        open: false,
        content: null,
        severity: null
    });
    const {
        register,
        setValue,
        handleSubmit,
        reset,
        getValues,
        formState: {errors}
    } = useForm<CreateOrUpdateContractRequestAnn>();

    useEffect(() => {
        getAllCreateOrUpdateContractAnn()
            .then((resRequests: CreateOrUpdateContractRequestAnn[]) => {
                setContractRequests(resRequests);
                if (resRequests.length > 0) {
                    setSelectedRequest(resRequests[0]);
                    setFormValue(resRequests[0]);
                    getProductByCriteria({
                        catalogIdList: [],
                        enterpriseIdList: [resRequests[0].enterpriseId]
                    }).then((resProducts: Product[]) => {
                        setProducts(resProducts);
                    }).catch((err: ExceptionResponse) => {
                        console.log(err);
                    }).finally(() => {
                        setIsShow(true);
                    })
                }
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        }).finally(() => {
            setIsShow(true);
        })
    }, []);

    const handleClickDetail = (requestId: number) => {
        let newSelectedRequest = contractRequests.find(x => x.id == requestId);
        setSelectedRequest(newSelectedRequest);
        setFormValue(newSelectedRequest);
    }

    const setFormValue = (request: CreateOrUpdateContractRequestAnn) => {
        setValue("startDate", request.startDate);
        setValue("endDate", request.endDate);
        setValue("updateEndDate", request.updateEndDate);
        setValue("commissionRate", request.commissionRate);
        setValue("updateCommissionRate", request.updateCommissionRate);
        setValue("cashPerPoint", request.cashPerPoint);
        setValue("updateCashPerPoint", request.updateCashPerPoint);
        setValue("contractStatus", request.contractStatus);
        setValue("updateContractStatus", request.updateContractStatus);
        setValue("isEdit", request.isEdit);
        setValue("contractChangeRequestStatus", request.contractChangeRequestStatus);
        setValue("cancelReason", request.cancelReason);
    }

    const onSubmit = handleSubmit(data => {
        handleAcceptCreateOrUpdateContractRequest(selectedRequest)
            .then((res: string) => {
                let newSelectedRequest: CreateOrUpdateContractRequestAnn = selectedRequest;
                newSelectedRequest.contractChangeRequestStatus = ContractChangeRequestStatus.ACCEPT;
                setSelectedRequest(newSelectedRequest);

                let newContractRequests = [...contractRequests];
                newContractRequests.find(x => x.id == newSelectedRequest.id).contractChangeRequestStatus = ContractChangeRequestStatus.ACCEPT;
                setContractRequests([...newContractRequests])

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
    });


    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Contract Change Request"}/>
                <Stack spacing={2}>
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}
                         className={"content-box"}>
                        <RequestList requests={contractRequests}
                                     onClickDetail={(id: number) => handleClickDetail(id)}/>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2}}
                         className={"content-box"}>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                            <Chip label={selectedRequest.contractChangeRequestStatus} size={"small"}
                                  style={{
                                      backgroundColor: getChipStyle(selectedRequest.contractChangeRequestStatus).chipBgColor,
                                      color: getChipStyle(selectedRequest.contractChangeRequestStatus).chipTextColor
                                  }}/>
                            <Typography
                                className={"page-sub-header"}>{selectedRequest.enterprise.enterpriseName}</Typography>
                            <Chip style={{
                                textAlign: "right",
                                marginLeft: "auto"
                            }} label={selectedRequest.isEdit ? "Update" : "Create"} color="primary" variant="outlined"/>
                        </Box>
                        <Divider/>
                        <form onSubmit={onSubmit} style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Typography gutterBottom>Start Date </Typography>
                                    <TextField
                                        {...register("startDate")} disabled={true}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography gutterBottom>End Date </Typography>
                                    <TextField
                                        {...register("endDate")} disabled={true}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography gutterBottom>Commission Rate </Typography>
                                    <TextField
                                        {...register("commissionRate")} disabled={true}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography gutterBottom>Cash Per Point </Typography>
                                    <TextField
                                        {...register("cashPerPoint")} disabled={true}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography gutterBottom>Status</Typography>
                                    <TextField
                                        {...register("contractStatus")} disabled={true}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                {
                                    (isNotNull(selectedRequest.updateEndDate) && selectedRequest.endDate != selectedRequest.updateEndDate) ? (
                                        <Grid item xs={3}>
                                            <Typography gutterBottom>Change Request End Date </Typography>
                                            <TextField
                                                {...register("updateEndDate")} disabled={true}
                                                fullWidth
                                                size={"small"}/>
                                        </Grid>
                                    ) : (
                                        <Grid item xs={3}>
                                        </Grid>
                                    )
                                }
                                {
                                    (isNotNull(selectedRequest.updateCommissionRate) && selectedRequest.commissionRate != selectedRequest.updateCommissionRate) ? (
                                        <Grid item xs={3}>
                                            <Typography gutterBottom>Change Request Commission Rate </Typography>
                                            <TextField
                                                {...register("updateCommissionRate")} disabled={true}
                                                fullWidth
                                                size={"small"}/>
                                        </Grid>
                                    ) : (
                                        <Grid item xs={3}>
                                        </Grid>
                                    )
                                }
                                {
                                    (isNotNull(selectedRequest.updateCashPerPoint) && selectedRequest.cashPerPoint != selectedRequest.updateCashPerPoint) ? (
                                        <Grid item xs={3}>
                                            <Typography gutterBottom>Change Request Cash Per Point </Typography>
                                            <TextField
                                                {...register("updateCashPerPoint")} disabled={true}
                                                fullWidth
                                                size={"small"}/>
                                        </Grid>
                                    ) : (
                                        <Grid item xs={3}>
                                        </Grid>
                                    )
                                }
                                <Grid item xs={3}>
                                    {/*<Typography gutterBottom>Change Request Status</Typography>*/}
                                    {/*<TextField*/}
                                    {/*    {...register("updateContractStatus")} disabled={true}*/}
                                    {/*    fullWidth*/}
                                    {/*    size={"small"}/>*/}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} justifyContent={"flex-end"}>
                                <Grid item xs={3}>
                                    <Button type={"submit"} variant={"contained"}
                                            color={selectedRequest.contractChangeRequestStatus == ContractChangeRequestStatus.RECEIVED ? "primary" : "success"}
                                            fullWidth
                                            disabled={selectedRequest.contractChangeRequestStatus == ContractChangeRequestStatus.ACCEPT}
                                    >{selectedRequest.contractChangeRequestStatus == ContractChangeRequestStatus.RECEIVED ? "Accept" : "Accepted"}</Button>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button variant={"outlined"} fullWidth
                                            disabled={selectedRequest.contractChangeRequestStatus == ContractChangeRequestStatus.ACCEPT}
                                    >Refuse</Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} justifyContent={"flex-end"}>
                                <Grid item xs={6}>
                                    {
                                        showAlert.open && (
                                            <Alert severity={showAlert.severity}>{showAlert.content}</Alert>
                                        )
                                    }
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                    <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                        <Typography className={"page-sub-header"}>Products Selling</Typography>
                        <Divider/>
                        {
                            products && products.length > 0 && (
                                <ProductSellingList products={products}
                                                    oldCashPerPoint={selectedRequest.cashPerPoint}
                                                    updateCashPerPoint={selectedRequest.updateCashPerPoint}
                                                    enterprise={selectedRequest.enterprise}/>
                            )
                        }
                    </Box>
                </Stack>
            </Stack>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminCooperationContractRequestManagementPage;