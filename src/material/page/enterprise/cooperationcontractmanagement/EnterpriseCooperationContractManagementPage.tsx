import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import {Enterprise} from "../../../model/Enterprise";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {CooperationContract} from "../../../model/CooperationContract";
import {getCooperationContractByCriteria, handleReceiveCreateOrUpdateContract} from "../../../service/contract.service";
import {
    CooperationContractSearchCriteriaRequest
} from "../../../model/request/CooperationContractSearchCriteriaRequest";
import {Link, useHistory} from "react-router-dom";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import {Alert, Chip, MenuItem, Stack, Tooltip} from "@mui/material";
import {ContractStatus} from "../../../model/enums/ContractStatus";
import {useForm} from "react-hook-form";
import {OrderStatus} from "../../../model/enums/OrderStatus";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import {isNotNull} from "../../../util/object.util";
import {Product} from "../../../model/Product";
import {getProductByCriteria} from "../../../service/product.service";
import {AssetPath, EnterpriseRouter} from "../../../config/router";
import {createSeoLink, formatVndMoney} from "../../../util/display.util";
import Avatar from "@mui/material/Avatar";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {contractStatusOptions} from "../../../util/filter.util";

interface Props {
    cooperationContracts?: CooperationContract[],
    currentEnterprise?: Enterprise,
    onSearchContract?: Function,
    cooperationContractSearchCriteriaRequest?: CooperationContractSearchCriteriaRequest,
    products?: Product[],
    updateCashPerPoint?: number
    onClickEdit?: Function
}

interface ContractStatusStep {
    label: string,
    value: ContractStatus
}


const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Contract",
        isLasted: true
    },
]


export interface ChipStyle {
    chipBgColor: string,
    chipTextColor: string,
}

export const getChipStyle = (status: ContractStatus) => {
    let chipBgColor = null;
    let chipTextColor = "#212121";
    switch (status) {
        case ContractStatus.PENDING: {
            chipBgColor = "#8A909D";
            chipTextColor = "#fff";
            break;
        }
        case ContractStatus.ACTIVE: {
            chipBgColor = "#13CAE1";
            chipTextColor = "#fff";
            break;
        }
        case ContractStatus.INACTIVE: {
            chipBgColor = "#F44336";
            chipTextColor = "#fff";
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

const RequestList: React.FC<Props> = ({cooperationContracts, onClickEdit}) => {

    const history = useHistory();

    /*TODO: implement pagination*/
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.3
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.startDate.slice(0, 10)}</Typography>
                );
            }
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.endDate.slice(0, 10)}</Typography>
                );
            }
        },
        {
            field: 'commissionRate',
            headerName: 'Commission Rate',
            flex: 0.5,
        },
        {
            field: 'cashPerPoint',
            headerName: 'Cash Per Point',
            flex: 0.5,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                let requestStatus: ContractStatus = params.row.contractStatus;
                let chipStyle: ChipStyle = getChipStyle(requestStatus);

                return (
                    <Chip label={params.row.contractStatusDescription} size={"small"}
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
                    label="Edit"
                    showInMenu
                    onClick={() => onClickEdit(params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={cooperationContracts}
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


const EnterpriseCooperationContractSearch: React.FC<Props> = ({onSearchContract}) => {

    const {
        register,
        setValue,
        handleSubmit,
        formState: {errors}
    } = useForm<CooperationContractSearchCriteriaRequest>();

    const contractStatusList: ContractStatusStep[] = [
        {
            label: "All",
            value: ContractStatus.ALL
        },
        {
            label: "Chưa áp dụng",
            value: ContractStatus.PENDING
        },
        {
            label: "Đang áp dụng",
            value: ContractStatus.ACTIVE
        },
        {
            label: "Hết hạn",
            value: ContractStatus.INACTIVE
        }
    ];

    const onSubmit = handleSubmit(data => {
        let criteria: CooperationContractSearchCriteriaRequest = {
            startDate: data.startDate,
            endDate: data.endDate,
            contractStatus: data.contractStatus == ContractStatus.ALL ? null : data.contractStatus
        }
        onSearchContract(criteria);
    });

    return (
        <Box sx={{display: "flex", gap: 2}}>
            <form onSubmit={onSubmit} style={{display: "flex", gap: "16px"}}>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Typography>From Date</Typography>
                    <TextField {...register("startDate")} type={"date"} style={{width: "150px"}} size={"small"}/>
                </Box>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Typography>To Date</Typography>
                    <TextField {...register("endDate")} type={"date"} style={{width: "150px"}} size={"small"}/>
                </Box>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Typography>Status</Typography>
                    <TextField
                        select
                        defaultValue={OrderStatus.ALL}
                        {...register("contractStatus")}
                        style={{width: "150px"}} size={"small"}
                    >
                        {contractStatusList.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Button type={"submit"} variant={"contained"}>Search</Button>
            </form>
        </Box>
    )
}

const ProductSellingList = ({products, updateCashPerPoint, currentEnterprise}) => {

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
                        title={currentEnterprise.enterpriseName}>
                        <Avatar alt="img"
                                src={AssetPath.enterpriseLogoUrl + currentEnterprise.logoUrl}
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
                                to={EnterpriseRouter.productDetailPage + "/" + createSeoLink(product.productName) + "." + product.id}
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
                                            product.exchangeAblePoints.filter(x => x.enterprise.id == currentEnterprise.id).map((productPoint, index) => (
                                                <Box sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1
                                                }}>
                                                    <ProductPoint point={productPoint.pointExchange}/>
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


const EnterpriseCooperationContractManagementPage: React.FC<Props> = ({currentEnterprise}) => {

    const [cooperationContracts, setCooperationContracts] = useState<CooperationContract[]>();
    const [selectedContract, setSelectedContract] = useState<CooperationContract>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>();

    const {
        register,
        setValue,
        handleSubmit,
        reset,
        getValues,
        formState: {errors}
    } = useForm<CooperationContract>();
    const [selectedContractStatus, setSelectedContractStatus] = useState<ContractStatus>(ContractStatus.PENDING);

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [updateCashPerPoint, setUpdateCashPerPoint] = useState<number>(null);
    const [showAlert, setShowAlert] = useState({
        open: false,
        content: null,
        severity: null
    });

    const onSubmit = handleSubmit(data => {
        handleReceiveCreateOrUpdateContract({
            id: data.id,
            enterprise: currentEnterprise,
            startDate: data.startDate,
            endDate: data.endDate,
            commissionRate: data.commissionRate,
            cashPerPoint: data.cashPerPoint,
            contractStatus: selectedContractStatus
        }).then((res: string) => {
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

    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            setShowAlert(prevState4 => ({
                ...prevState4,
                open: false,
            }));
        }, 3000)

        return () => {
            clearTimeout(timeId)
        }

    }, [showAlert]);

    useEffect(() => {
        let criteria: CooperationContractSearchCriteriaRequest = {
            startDate: null,
            endDate: null,
            contractStatus: null,
            enterpriseId: currentEnterprise.id
        }
        getCooperationContractByCriteria(criteria)
            .then((resCooperationContracts: CooperationContract[]) => {
                setCooperationContracts(resCooperationContracts);
                // if (resCooperationContracts.length > 0) {
                //     let newItem: CooperationContract = resCooperationContracts[0];
                //     setFormValue(newItem);
                //     setSelectedContract(newItem);
                //     setSelectedContractStatus(newItem.contractStatus)
                // }
                getProductByCriteria({
                    catalogIdList: [],
                    enterpriseIdList: [currentEnterprise.id]
                }).then((resProducts: Product[]) => {
                    setProducts(resProducts);
                }).catch((err: ExceptionResponse) => {
                    console.log(err);
                }).finally(() => {
                    setIsShow(true);
                })
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
        document.title = currentEnterprise.enterpriseName + " - Contract";

    }, []);

    const setFormValue = (newItem: CooperationContract) => {
        setValue("id", newItem.id);
        setValue("contractStatus", newItem.contractStatus);
        setValue("startDate", newItem.startDate);
        setValue("endDate", newItem.endDate);
        setValue("cashPerPoint", newItem.cashPerPoint);
        setValue("commissionRate", newItem.commissionRate);
    }

    const handleSearchContract = (criteria: CooperationContractSearchCriteriaRequest) => {
        getCooperationContractByCriteria(criteria)
            .then((resEnterpriseCoopeartionContracts: CooperationContract[]) => {
                setCooperationContracts(resEnterpriseCoopeartionContracts);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    const handleClickEdit = (id: number) => {
        let newItem: CooperationContract = cooperationContracts.find(x => x.id == id);
        if (newItem.contractStatus != ContractStatus.INACTIVE) {
            setIsEdit(true);
        }
        setFormValue(newItem);
        setSelectedContract(newItem);
        setSelectedContractStatus(newItem.contractStatus);
    }


    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Cooperation Contract"}/>
                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}
                     className={"content-box"}>
                    {
                        cooperationContracts.length > 0 ? (
                            <RequestList cooperationContracts={cooperationContracts}
                                         onClickEdit={(id: number) => handleClickEdit(id)}/>
                        ) : (
                            <Typography>You don't have any contracts!</Typography>
                        )
                    }

                </Box>
                <form className={"content-box"} onSubmit={onSubmit}
                      style={{display: "flex", gap: "16px", flexDirection: "column", width: "100%"}}>
                    <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <Typography
                            className={"page-sub-header"}>{isEdit ? "Contract: #" + selectedContract.id : "New Contract"}</Typography>
                        <Button variant={"contained"}
                                disabled={selectedContractStatus == ContractStatus.INACTIVE}
                                type={"submit"}>{!isEdit ? "Request create" : 'Request change'}</Button>
                    </Box>
                    <Divider/>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Typography gutterBottom>Start Date</Typography>
                            <TextField {...register("startDate")} fullWidth size={"small"}
                                       disabled={selectedContractStatus != ContractStatus.PENDING}
                                       type={"date"}
                                       placeholder={"Start Date"}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography gutterBottom>End Date</Typography>
                            <TextField {...register("endDate")} fullWidth size={"small"}
                                       disabled={selectedContractStatus == ContractStatus.INACTIVE}
                                       type={"date"}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography gutterBottom>Commission Rate</Typography>
                            <TextField {...register("commissionRate")}
                                       disabled={selectedContractStatus == ContractStatus.INACTIVE}
                                       fullWidth size={"small"}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography gutterBottom>Cash Per Point</Typography>
                            <TextField {...register("cashPerPoint")} fullWidth size={"small"}
                                       disabled={selectedContractStatus == ContractStatus.INACTIVE}
                                       onChange={(e: any) => setUpdateCashPerPoint(Number.parseInt(e.target.value))}/>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography gutterBottom fontWeight={"bold"}>Status</Typography>
                            <TextField
                                select
                                value={selectedContractStatus}
                                disabled={selectedContractStatus != ContractStatus.PENDING}
                                onChange={(e) => setSelectedContractStatus(e.target.value as ContractStatus)}
                                size={"small"}
                                sx={{width: "100%"}}
                            >
                                {contractStatusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    {
                        showAlert.open && (
                            <Alert severity={showAlert.severity}>{showAlert.content}</Alert>
                        )
                    }
                </form>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <Typography className={"page-sub-header"}>Current Products Selling</Typography>
                    <Divider/>
                    {
                        products && products.length > 0 ? (
                            <ProductSellingList products={products} updateCashPerPoint={updateCashPerPoint}
                                                currentEnterprise={currentEnterprise}/>
                        ) : (
                            <Typography>You are still not selling any product yet!</Typography>
                        )
                    }
                </Box>
            </Stack>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default EnterpriseCooperationContractManagementPage;