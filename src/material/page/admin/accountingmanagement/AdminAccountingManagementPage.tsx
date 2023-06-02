import {Alert, Autocomplete, Box, Chip, MenuItem, Stack} from "@mui/material";
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
import {paymentStatusOptions} from "../../../util/filter.util";
import {isNotNull} from "../../../util/object.util";
import {Accounting} from "../../../model/enterprise/Accounting";
import {AccountingSearchCriteriaRequest} from "../../../model/request/AccountingSearchCriteriaRequest";
import {PaymentStatus} from "../../../model/enums/PaymentStatus";
import {formatVndMoney} from "../../../util/display.util";
import {calculateAccounting, getAccountingByCriteria} from "../../../service/accounting.service";
import {ErrorText} from "../../common/share/ErrorText";

interface Props {
    accountings?: Accounting[],
    onSearchAccounting?: Function,
    enterpriseFilters?: AbstractFilter[]
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Accounting",
        isLasted: true
    },
]

const AccountingSearch: React.FC<Props> = ({onSearchAccounting, enterpriseFilters}) => {

    const {
        register,
        setValue,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm<AccountingSearchCriteriaRequest>();
    const [selectedEnterprise, setSelectedEnterprise] = useState<AbstractFilter>(null);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus>(PaymentStatus.ALL);

    const onSubmit = handleSubmit(data => {
        // TODO: handle search for other criteria too
        let criteria: AccountingSearchCriteriaRequest = {
            startDate: data.startDate,
            endDate: data.endDate,
            paymentStatus: selectedPaymentStatus,
            enterpriseId: isNotNull(selectedEnterprise) ? selectedEnterprise.value : null
        }
        onSearchAccounting(criteria);
    });

    const handleClearFilter = () => {
        reset();
        setSelectedEnterprise(null);
        setSelectedPaymentStatus(PaymentStatus.ALL);
        let criteria: AccountingSearchCriteriaRequest = {}
        onSearchAccounting(criteria);
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
                            defaultValue={PaymentStatus.ALL}
                            value={selectedPaymentStatus}
                            onChange={(e) => setSelectedPaymentStatus(e.target.value as PaymentStatus)}
                            fullWidth size={"small"}
                        >
                            {paymentStatusOptions.map((option) => (
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

const ContractList: React.FC<Props> = ({accountings}) => {

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
            field: 'totalIncome',
            headerName: 'Income',
            flex: 0.3,
            valueGetter: ({value}) => value && formatVndMoney(value),
        },
        {
            field: 'totalCommission',
            headerName: 'Total Commission',
            flex: 0.3,
            valueGetter: ({value}) => value && formatVndMoney(value)
        },
        {
            field: 'paymentDate',
            headerName: 'Payment Date',
            flex: 0.3,
            valueGetter: ({value}) => value && value.slice(0, 10),
        },
        {
            field: 'commissionRate',
            headerName: 'Commission Rate',
            flex: 0.3,
        },
        {
            field: 'paymentStatus',
            headerName: 'Payment Status',
            flex: 0.4,
            renderCell(params: GridCellParams) {

                let paymentStatus: PaymentStatus = params.row.paymentStatus;
                let chipBgColor = null;
                let chipTextColor = "#212121";
                switch (paymentStatus) {
                    case PaymentStatus.UNPAID: {
                        chipBgColor = "#8A909D";
                        chipTextColor = "#fff";
                        break;
                    }
                    case PaymentStatus.PAID: {
                        chipBgColor = "#29CC97";
                        chipTextColor = "#fff";
                        break;
                    }
                    default: {
                        break;
                    }
                }

                return (
                    <Chip label={params.row.paymentStatusDescription} size={"small"}
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
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={accountings}
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
            />
        </Box>
    )
}


const AdminAccountingManagementPage: React.FC<Props> = ({}) => {

    const [accountings, setAccountings] = useState<Accounting[]>([]);
    const [enterpriseFilters, setEnterpriseFilters] = useState<AbstractFilter[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [show, setShow] = useState(true)
    const [showAlert, setShowAlert] = useState({
        open: false,
        content: null,
        severity: null
    });

    const [searchCriteria, setSearchCriteria] = useState<AccountingSearchCriteriaRequest>();

    useEffect(() => {
        let criteria: AccountingSearchCriteriaRequest = {}
        getAccountingByCriteria(criteria)
            .then((resAccountings: Accounting[]) => {
                setAccountings(resAccountings);
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
    }, []);

    useEffect(() => {
        setShow(true);
        const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            setShow(false)
        }, 3000)

        return () => {
            clearTimeout(timeId)
        }
        document.title = "Admin - Accountings";
    }, [showAlert]);

    const handleSearchAccounting = async (criteria: AccountingSearchCriteriaRequest) => {
        if (criteria.paymentStatus == PaymentStatus.ALL) {
            criteria.paymentStatus = null;
        }
        setSearchCriteria(criteria);
        getAccountingByCriteria(criteria)
            .then((resAccountings: Accounting[]) => {
                setAccountings([...resAccountings]);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }


    const {
        register,
        setValue,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm<AccountingSearchCriteriaRequest>();

    const onSubmit = handleSubmit(data => {
        calculateAccounting(data)
            .then((res) => {
                setShowAlert(prevState4 => ({
                    ...prevState4,
                    open: true,
                    content: res,
                    severity: "success"
                }));
                getAccountingByCriteria(searchCriteria)
                    .then((resAccountings: Accounting[]) => {
                        setAccountings([...resAccountings]);
                    })
                    .catch((err: ExceptionResponse) => {
                        console.log(err);
                    })
            }).catch((err: ExceptionResponse) => {
            console.log(err);
            setShowAlert(prevState4 => ({
                ...prevState4,
                open: true,
                content: err.errorMessage,
                severity: "error"
            }));
        })
    });

    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Contract"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <form onSubmit={onSubmit} style={{width: "100%"}}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography gutterBottom>Start Date</Typography>
                                <TextField {...register("startDate", {required: true})} type={"date"} fullWidth
                                           size={"small"}
                                           error={!!errors.startDate}/>
                                {errors.startDate &&
                                    <ErrorText text={"Start Date is required"}/>}
                            </Grid>
                            <Grid item xs={3}>
                                <Typography gutterBottom>End Date</Typography>
                                <TextField {...register("endDate", {required: true})} type={"date"} fullWidth
                                           size={"small"}
                                           error={!!errors.endDate}/>
                                {errors.endDate &&
                                    <ErrorText text={"End Date is required"}/>}
                            </Grid>
                            <Grid item xs={2}>
                                <Typography gutterBottom color={"#fff"}>empty</Typography>
                                <Button variant={"contained"} type={"submit"}>Calculate income</Button>
                            </Grid>
                            <Grid item xs={4}>
                                {
                                    showAlert.open && show && (
                                        <Alert severity={showAlert.severity}>{showAlert.content}</Alert>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </form>
                </Box>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <AccountingSearch enterpriseFilters={enterpriseFilters}
                                      onSearchAccounting={(criteria: AccountingSearchCriteriaRequest) => handleSearchAccounting(criteria)}/>
                </Box>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <ContractList accountings={accountings}/>
                </Box>
            </Stack>
        );
    } else {
        return (
            <PageSpinner/>
        )
    }

}

export default AdminAccountingManagementPage;