import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import {Enterprise} from "../../../model/Enterprise";
import {getCurrentEnterpriseInfo} from "../../../service/enterprise.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {EnterpriseCooperationContract} from "../../../model/enterprise/EnterpriseCooperationContract";
import {getCooperationContractForCurrentEnterpriseByCriteria} from "../../../service/contract.service";
import {
    EnterpriseCooperationContractSearchCriteriaRequest
} from "../../../model/request/EnterpriseCooperationContractSearchCriteriaRequest";
import {useHistory} from "react-router-dom";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import {Chip, MenuItem} from "@mui/material";
import {ContractStatus} from "../../../model/enums/ContractStatus";
import {useForm} from "react-hook-form";
import {OrderStatus} from "../../../model/enums/OrderStatus";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface Props {
    enterpriseCooperationContracts?: EnterpriseCooperationContract[],
    currentEnterprise?: Enterprise,
    onSearchContract?: Function,
    enterpriseCooperationContractSearchCriteriaRequest?: EnterpriseCooperationContractSearchCriteriaRequest
}

interface ContractStatusStep {
    label: string,
    value: ContractStatus
}

const CooperationContractList: React.FC<Props> = ({enterpriseCooperationContracts}) => {

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
            flex: 0.5
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            flex: 0.5
        },
        {
            field: 'cashPerPoint',
            headerName: 'Cash Per Point',
            flex: 0.5
        },
        {
            field: 'commissionRate',
            headerName: 'Commission Rate',
            flex: 0.5
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                let contractStatus: ContractStatus = params.row.contractStatus;
                let chipBgColor = null;
                let chipTextColor = "#212121";
                switch (contractStatus) {
                    case ContractStatus.PENDING: {
                        chipBgColor = "#8A909D";
                        chipTextColor = "#fff";
                        break;
                    }
                    case ContractStatus.ACTIVE: {
                        chipBgColor = "#29CC97";
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

                return (
                    <Chip label={params.row.contractStatusDescription} size={"small"}
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
                    label="Request change"
                    showInMenu
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={enterpriseCooperationContracts}
                columns={columns}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false
                        },
                    },
                }}
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
    } = useForm<EnterpriseCooperationContractSearchCriteriaRequest>();

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
        let criteria: EnterpriseCooperationContractSearchCriteriaRequest = {
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


const EnterpriseCooperationContractManagementPage: React.FC<Props> = () => {

    const [enterpriseCooperationContracts, setEnterpriseCooperationContracts] = useState<EnterpriseCooperationContract[]>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [currentEnterprise, setCurrentEnterprise] = useState<Enterprise>(null);

    useEffect(() => {
        let criteria: EnterpriseCooperationContractSearchCriteriaRequest = {
            startDate: null,
            endDate: null,
            contractStatus: null
        }
        getCooperationContractForCurrentEnterpriseByCriteria(criteria)
            .then((resEnterpriseCooperationContracts: EnterpriseCooperationContract[]) => {
                setEnterpriseCooperationContracts(resEnterpriseCooperationContracts);
                getCurrentEnterpriseInfo()
                    .then((resEnterprise: Enterprise) => {
                        setCurrentEnterprise(resEnterprise);
                    }).catch((err: ExceptionResponse) => {
                    console.log(err);
                });
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
            .finally(() => {
                setIsShow(true);
            });
    }, []);

    const handleSearchContract = (criteria: EnterpriseCooperationContractSearchCriteriaRequest) => {
        getCooperationContractForCurrentEnterpriseByCriteria(criteria)
            .then((resEnterpriseCoopeartionContracts: EnterpriseCooperationContract[]) => {
                setEnterpriseCooperationContracts(resEnterpriseCoopeartionContracts);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    if (isShow) {
        return (
            <Box
                sx={{display: "flex", flexDirection: "column", gap: 2, backgroundColor: "#fff", p: 2, borderRadius: 2}}>
                <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Typography variant={"h6"} fontWeight={"bold"}>Cooperation contract</Typography>
                    <Button variant={"outlined"}>Request new</Button>
                </Box>
                <EnterpriseCooperationContractSearch
                    onSearchContract={(criteria: EnterpriseCooperationContractSearchCriteriaRequest) => handleSearchContract(criteria)}/>
                <CooperationContractList enterpriseCooperationContracts={enterpriseCooperationContracts}/>
            </Box>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default EnterpriseCooperationContractManagementPage;