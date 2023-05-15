import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {Box, Chip} from "@mui/material";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import {EnterpriseAccounting} from "../../../model/enterprise/EnterpriseAccounting";
import {
    createNewUrlProcessPaymentAccountingForCurrentEnterprise,
    getAllAccountingForCurrentEnterprise
} from "../../../service/accounting.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef, GridRowId} from "@mui/x-data-grid-premium";
import {formatVndMoney} from "../../../util/other.util";
import {PaymentStatus} from "../../../model/enums/PaymentStatus";


interface Props {
    enterpriseAccountings: EnterpriseAccounting[],
    onProcessPayment: Function
}

const EnterpriseAccountingList: React.FC<Props> = ({enterpriseAccountings, onProcessPayment}) => {

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
                rows={enterpriseAccountings}
                columns={columns}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    )
}

const EnterpriseAccountingPage: React.FC<Props> = () => {

    const [enterpriseAccountings, setEnterpriseAccountings] = useState<EnterpriseAccounting[]>([]);
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        getAllAccountingForCurrentEnterprise()
            .then((resEnterpriseAccountings: EnterpriseAccounting[]) => {
                setEnterpriseAccountings(resEnterpriseAccountings);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
            .finally(() => {
                setIsShow(true);
            })
    }, []);

    const processPayment = (accountingId: number) => {
        createNewUrlProcessPaymentAccountingForCurrentEnterprise(accountingId)
            .then((res: string) => {
                console.log(res);
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
    }

    if (isShow) {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 2, p: 2, backgroundColor: "#fff"}}>
                <Typography variant={"h6"} fontWeight={"bold"}>Accounting</Typography>
                <EnterpriseAccountingList enterpriseAccountings={enterpriseAccountings}
                                          onProcessPayment={(accountingId: number) => processPayment(accountingId)}/>
            </Box>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default EnterpriseAccountingPage;