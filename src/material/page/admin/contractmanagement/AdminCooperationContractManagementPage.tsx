import {Autocomplete, Box, Chip, LinearProgress, LinearProgressProps, MenuItem, Stack} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef, GridToolbar} from "@mui/x-data-grid-premium";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import Button from "@mui/material/Button";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {useForm} from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Enterprise} from "../../../model/Enterprise";
import {getAllEnterprise} from "../../../service/enterprise.service";
import {AbstractFilter} from "../../../model/AbstractFilter";
import {useHistory} from "react-router-dom";
import {CooperationContract} from "../../../model/CooperationContract";
import {
    CooperationContractSearchCriteriaRequest
} from "../../../model/request/CooperationContractSearchCriteriaRequest";
import {ContractStatus} from "../../../model/enums/ContractStatus";
import {contractStatusOptions} from "../../../util/filter.util";
import {getCooperationContractByCriteria, syncContractStatus} from "../../../service/contract.service";
import {
    ChipStyle,
    getChipStyle
} from "../../enterprise/cooperationcontractmanagement/EnterpriseCooperationContractManagementPage";
import {isNotNull} from "../../../util/object.util";

interface Props {
    contracts?: CooperationContract[],
    onSearchContracts?: Function,
    enterpriseFilters?: AbstractFilter[]
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Contract",
        isLasted: true
    },
]

const ContractSearch: React.FC<Props> = ({onSearchContracts, enterpriseFilters}) => {

    const {
        register,
        setValue,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm<CooperationContractSearchCriteriaRequest>();
    const [selectedEnterprise, setSelectedEnterprise] = useState<AbstractFilter>(null);
    const [selectedContractStatus, setSelectedContractStatus] = useState<ContractStatus>(ContractStatus.ALL);

    const onSubmit = handleSubmit(data => {
        // TODO: handle search for other criteria too
        let criteria: CooperationContractSearchCriteriaRequest = {
            startDate: data.startDate,
            endDate: data.endDate,
            contractStatus: selectedContractStatus,
            enterpriseId: isNotNull(selectedEnterprise) ? selectedEnterprise.value : null
        }
        onSearchContracts(criteria);
    });

    const handleClearFilter = () => {
        reset();
        setSelectedEnterprise(null);
        setSelectedContractStatus(ContractStatus.ALL);
        let criteria: CooperationContractSearchCriteriaRequest = {}
        onSearchContracts(criteria);
    }

    return (
        <Box sx={{display: "flex", gap: 2}}>
            <form onSubmit={onSubmit} style={{width: "100%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography gutterBottom>Start Date</Typography>
                        <TextField {...register("startDate")} type={"date"} fullWidth size={"small"}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom>End Date</Typography>
                        <TextField {...register("endDate")} fullWidth type={"date"} size={"small"}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom>
                            Enterprise
                        </Typography>
                        <Autocomplete
                            id="tags-standard"
                            options={enterpriseFilters}
                            value={selectedEnterprise}
                            onChange={(e, item) => {
                                setSelectedEnterprise(item)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size={"small"}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom>Status</Typography>
                        <TextField
                            select
                            defaultValue={ContractStatus.ALL}
                            value={selectedContractStatus}
                            onChange={(e) => setSelectedContractStatus(e.target.value as ContractStatus)}
                            fullWidth size={"small"}
                        >
                            {contractStatusOptions.map((option) => (
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

const ContractList: React.FC<Props> = ({contracts}) => {

    const history = useHistory();

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'enterprise',
            headerName: 'Enterprise',
            flex: 0.4,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.enterprise.enterpriseName}</Typography>
                );
            }
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            flex: 0.4,
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            flex: 0.3,
        },
        {
            field: 'commissionRate',
            headerName: 'Commission Rate',
            flex: 0.3,
        },
        {
            field: 'cashPerPoint',
            headerName: 'Cash Per Point',
            flex: 0.3,
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
                    label="Detail"
                    showInMenu
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={contracts}
                columns={columns}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                slots={{
                    toolbar: GridToolbar,
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
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


const AdminCooperationContractManagementPage: React.FC<Props> = ({}) => {

    const [contracts, setContracts] = useState<CooperationContract[]>([]);
    const [enterpriseFilters, setEnterpriseFilters] = useState<AbstractFilter[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [sync, setSync] = useState<any>({
        isSync: false,
        isDone: false,
        progress: 10,
        label: "Sync contract status"
    });
    const [searchCriteria, setSearchCriteria] = useState<CooperationContractSearchCriteriaRequest>();

    useEffect(() => {
        let criteria: CooperationContractSearchCriteriaRequest = {}
        getCooperationContractByCriteria(criteria)
            .then((resContracts: CooperationContract[]) => {
                setContracts(resContracts);
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
                    })
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            }).finally(() => {
            setIsShow(true);
        })
        document.title = "Admin - Contracts";
    }, []);

    const handleSearchContract = async (criteria: CooperationContractSearchCriteriaRequest) => {
        if (criteria.contractStatus == ContractStatus.ALL) {
            criteria.contractStatus = null;
        }
        console.log(criteria);
        setSearchCriteria(criteria);
        getCooperationContractByCriteria(criteria)
            .then((resContracts: CooperationContract[]) => {
                setContracts([...resContracts]);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    const handleSync = () => {
        syncContractStatus()
            .then((res: string) => {
                console.log(res);
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        });
        setSync(prevState1 => ({
            ...prevState1,
            isSync: true,
            label: "Syncing..."
        }));
        const timer = setInterval(() => {
            setSync(prevState2 => ({
                ...prevState2,
                label: prevState2.progress < 100 ? "Syncing..." : "Done",
                progress: Math.min(prevState2.progress + Math.random() * 10, 100)
            }));
        }, 800);
        return () => {
            clearInterval(timer);
        };
    }

    const LinearProgressWithLabel = (props: LinearProgressProps & { value: number }) => {


        return (
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{width: '100%', mr: 1}}>
                    <LinearProgress variant="determinate" {...props} />
                </Box>
                <Box sx={{minWidth: 35}}>
                    {
                        props.value < 100 ? (
                            <Typography variant="body2" color="text.secondary">{`${Math.round(
                                props.value,
                            )}%`}</Typography>
                        ) : (
                            <Typography variant="body2" style={{color: "var(--bluebreak-600)"}}>{"Done"}</Typography>
                        )
                    }

                </Box>
            </Box>
        );
    }


    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Contract"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <Grid container alignItems={"center"} spacing={2}>
                        <Grid item xs={2}>
                            <Button variant={"contained"} fullWidth onClick={() => handleSync()}
                                    disabled={sync.isSync}
                            >{sync.label}</Button>
                        </Grid>
                        <Grid item xs={10}>
                            {
                                sync.isSync && (
                                    <LinearProgressWithLabel value={sync.progress}/>
                                )
                            }
                        </Grid>
                    </Grid>
                </Box>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <ContractSearch enterpriseFilters={enterpriseFilters}
                                    onSearchContracts={(criteria: CooperationContractSearchCriteriaRequest) => handleSearchContract(criteria)}/>
                </Box>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <ContractList contracts={contracts}/>
                </Box>
            </Stack>
        );
    } else {
        return (
            <PageSpinner/>
        )
    }

}

export default AdminCooperationContractManagementPage;