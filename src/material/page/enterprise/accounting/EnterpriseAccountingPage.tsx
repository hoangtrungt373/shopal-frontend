import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Box, Chip, Grid, MenuItem, Stack} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import {Accounting} from "../../../model/enterprise/Accounting";
import {
    createNewUrlProcessPaymentAccountingForCurrentEnterprise,
    getAccountingByCriteria
} from "../../../service/accounting.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef, GridRowId} from "@mui/x-data-grid-premium";
import {formatVndMoney} from "../../../util/display.util";
import {PaymentStatus} from "../../../model/enums/PaymentStatus";
import {Enterprise} from "../../../model/Enterprise";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {useForm} from "react-hook-form";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {AccountingSearchCriteriaRequest} from "../../../model/request/AccountingSearchCriteriaRequest";
import {paymentStatusOptions} from "../../../util/filter.util";


interface Props {
    accountings?: Accounting[],
    onProcessPayment?: Function,
    currentEnterprise?: Enterprise,
    onSearchAccounting?: Function
}


const AccountingSearch: React.FC<Props> = ({onSearchAccounting, currentEnterprise}) => {

    const {
        register,
        setValue,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm<AccountingSearchCriteriaRequest>();
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<PaymentStatus>(PaymentStatus.ALL);

    const onSubmit = handleSubmit(data => {
        let criteria: AccountingSearchCriteriaRequest = {
            startDate: data.startDate,
            endDate: data.endDate,
            enterpriseId: currentEnterprise.id,
            paymentStatus: selectedPaymentStatus
        }
        onSearchAccounting(criteria);
    });

    const handleClearFilter = () => {
        reset();
        setSelectedPaymentStatus(PaymentStatus.ALL);
        let criteria: AccountingSearchCriteriaRequest = {}
        onSearchAccounting(criteria);
    }

    return (
        <Box sx={{display: "flex", gap: 2}}>
            <form onSubmit={onSubmit} style={{width: "100%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography gutterBottom>From date</Typography>
                        <TextField {...register("startDate")} type={"date"} size={"small"} fullWidth
                                   placeholder={"From date"}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom>To date</Typography>
                        <TextField {...register("endDate")} type={"date"} size={"small"} fullWidth
                                   placeholder={"To date"}/>
                    </Grid>
                    <Grid item xs={2}>
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

const AccountingList: React.FC<Props> = ({accountings, onProcessPayment}) => {

    const moveToPayment = useCallback(
        (accountingId: GridRowId) => () => {
            onProcessPayment(accountingId);
        },
        [],
    );

    /*TODO: implement pagination*/
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.1
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            flex: 0.3,
            valueGetter: ({value}) => value && value.slice(0, 10),
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            flex: 0.3,
            valueGetter: ({value}) => value && value.slice(0, 10),
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
            flex: 0.2,
            getActions: (params) => [
                <GridActionsCellItem
                    label="Detail"
                    showInMenu
                />,
                <GridActionsCellItem
                    label="Process to payment"
                    showInMenu
                    onClick={moveToPayment(params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={accountings}
                columns={columns}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
            />
        </Box>
    )
}

const EnterpriseAccountingPage: React.FC<Props> = ({currentEnterprise}) => {

    const [accountings, setAccountings] = useState<Accounting[]>([]);
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        getAccountingByCriteria({enterpriseId: currentEnterprise.id})
            .then((resAccountings: Accounting[]) => {
                console.log(resAccountings)
                setAccountings(resAccountings);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
            .finally(() => {
                setIsShow(true);
            });

        document.title = currentEnterprise.enterpriseName + " - Accounting";

    }, []);

    const processPayment = (accountingId: number) => {
        createNewUrlProcessPaymentAccountingForCurrentEnterprise(accountings.find(x => x.id == accountingId))
            .then((res: string) => {
                window.location.href = res;
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
    }

    const breadCrumbItems: BreadcrumbItem[] = [
        {
            title: "Accounting",
            isLasted: true
        }
    ]

    const handleSearchAccounting = (criteria: AccountingSearchCriteriaRequest) => {
        if (criteria.paymentStatus == PaymentStatus.ALL) {
            criteria.paymentStatus = null;
        }
        getAccountingByCriteria(criteria)
            .then((resAccountings: Accounting[]) => {
                setAccountings(resAccountings);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Accounting"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <AccountingSearch currentEnterprise={currentEnterprise}
                                      onSearchAccounting={(criteria: AccountingSearchCriteriaRequest) => handleSearchAccounting(criteria)}/>
                </Box>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <AccountingList accountings={accountings}
                                    onProcessPayment={(accountingId: number) => processPayment(accountingId)}/>
                </Box>
            </Stack>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default EnterpriseAccountingPage;