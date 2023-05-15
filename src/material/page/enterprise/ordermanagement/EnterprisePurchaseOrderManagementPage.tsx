import {Box, Chip, MenuItem} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {EnterprisePurchaseOrder} from "../../../model/enterprise/EnterprisePurchaseOrder";
import {getPurchaseOrderForCurrentEnterpriseByCriteria} from "../../../service/order.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import PageSpinner from "../../common/share/PageSpinner";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import Typography from "@mui/material/Typography";
import {Customer} from "../../../model/Customer";
import {OrderStatus} from "../../../model/enums/OrderStatus";
import './enterprisepurchaseordermanagementpage.css'
import {useForm} from "react-hook-form";
import TextField from "@mui/material/TextField";
import {
    EnterprisePurchaseOrderSearchCriteriaRequest
} from "../../../model/request/EnterprisePurchaseOrderSearchCriteriaRequest";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {AssetPath, EnterpriseRouter} from "../../../config/router";
import {createSeoLink, formatVndMoney} from "../../../util/other.util";
import {Enterprise} from "../../../model/Enterprise";
import {getCurrentEnterpriseInfo} from "../../../service/enterprise.service";
import Avatar from "@mui/material/Avatar";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";


interface Props {
    enterprisePurchaseOrders?: EnterprisePurchaseOrder[],
    onSearchPurchaseOrder?: Function
    currentEnterprise?: Enterprise
}

interface OrderStatusStep {
    label: string,
    value: OrderStatus
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Orders",
        isLasted: true
    }
]

const CustomerPurchaseOrderSearch: React.FC<Props> = ({onSearchPurchaseOrder}) => {

    const {
        register,
        setValue,
        handleSubmit,
        formState: {errors}
    } = useForm<EnterprisePurchaseOrderSearchCriteriaRequest>();

    const orderStatusList: OrderStatusStep[] = [
        {
            label: "All",
            value: OrderStatus.ALL
        },
        {
            label: "Open",
            value: OrderStatus.OPEN
        },
        {
            label: "Processing",
            value: OrderStatus.PROCESSING
        },
        {
            label: "In transit",
            value: OrderStatus.IN_TRANSIT
        },
        {
            label: "Delivered",
            value: OrderStatus.DELIVERED
        },
    ];

    const onSubmit = handleSubmit(data => {
        let criteria: EnterprisePurchaseOrderSearchCriteriaRequest = {
            startDate: data.startDate,
            endDate: data.endDate,
            orderStatus: data.orderStatus
        }
        onSearchPurchaseOrder(criteria);
    });

    return (
        <Box sx={{display: "flex", gap: 2}}>
            <form onSubmit={onSubmit} style={{display: "flex", gap: "16px"}}>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Typography>From date</Typography>
                    <TextField {...register("startDate")} type={"date"} style={{width: "150px"}} size={"small"}/>
                </Box>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Typography>To date</Typography>
                    <TextField {...register("endDate")} type={"date"} style={{width: "150px"}} size={"small"}/>
                </Box>
                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                    <Typography>Order status</Typography>
                    <TextField
                        select
                        defaultValue={OrderStatus.ALL}
                        {...register("orderStatus")}
                        style={{width: "150px"}} size={"small"}
                    >
                        {orderStatusList.map((option) => (
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

const CustomerPurchaseOrderList: React.FC<Props> = ({enterprisePurchaseOrders, currentEnterprise}) => {

    const history = useHistory();

    /*TODO: implement pagination*/
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.1
        },
        {
            field: 'customerFullName',
            headerName: 'Customer',
            flex: 0.5
        },
        {
            field: 'customerContactEmail',
            headerName: 'Email',
            flex: 0.7
        },
        {
            field: 'orderTotalItems',
            headerName: 'Items',
            flex: 0.1
        },
        {
            field: 'orderTotalPointExchange',
            headerName: 'Total point',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                return (
                    <Box sx={{display: "flex", gap: 0.5, alignItems: "center"}}>
                        <Typography
                            fontWeight={"bold"}>{params.row.orderTotalPointExchange}</Typography>
                        <Avatar alt="img"
                                src={AssetPath.enterpriseLogoUrl + currentEnterprise.logoUrl}
                                sx={{width: 20, height: 20}}/>
                    </Box>
                );
            }
        },
        {
            field: 'totalPrice',
            headerName: 'Total price',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{formatVndMoney(params.row.orderTotalCash)}</Typography>
                );
            }
        },
        {
            field: 'orderStatus',
            headerName: 'Order Status',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                let orderStatus: OrderStatus = params.row.orderStatus;
                let chipBgColor = null;
                let chipTextColor = "#212121";
                switch (orderStatus) {
                    case OrderStatus.OPEN: {
                        chipBgColor = "#8A909D";
                        chipTextColor = "#fff";
                        break;
                    }
                    case OrderStatus.PROCESSING: {
                        chipBgColor = "#FEC400";
                        break;
                    }
                    case OrderStatus.IN_TRANSIT: {
                        chipBgColor = "#13CAE1";
                        chipTextColor = "#fff";
                        break;
                    }
                    case OrderStatus.DELIVERED: {
                        chipBgColor = "#29CC97";
                        chipTextColor = "#fff";
                        break;
                    }
                    case OrderStatus.CANCELLED: {
                        chipBgColor = "#F44336";
                        break;
                    }
                    default: {
                        break;
                    }
                }

                return (
                    <Chip label={params.row.orderStatusDescription} size={"small"}
                          style={{backgroundColor: chipBgColor, color: chipTextColor}}/>
                );
            }
        },
        {
            field: 'orderDate',
            headerName: 'Date',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                let dateParams = params.row.orderDate;
                let date = dateParams.slice(0, 10);
                let hour = new Date(dateParams).getHours();
                let minute = new Date(dateParams).getMinutes();

                let fullDateTime = date + " " + hour + ":" + minute;

                return (
                    <Typography>{fullDateTime}</Typography>
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
                    onClick={() => history.push(EnterpriseRouter.purchaseOrderManagement + "/" + createSeoLink(params.row.customerFullName + "-" + params.row.customerContactEmail) + "." + params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={enterprisePurchaseOrders}
                columns={columns}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
            />
        </Box>
    )
}

const EnterprisePurchaseOrderManagementPage: React.FC<Props> = ({}) => {

    const [enterprisePurchaseOrders, setEnterprisePurchaseOrders] = useState<EnterprisePurchaseOrder[]>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [currentEnterprise, setCurrentEnterprise] = useState<Enterprise>(null);

    useEffect(() => {
        let criteria: EnterprisePurchaseOrderSearchCriteriaRequest = {
            startDate: null,
            endDate: null,
            orderStatus: null
        }
        getPurchaseOrderForCurrentEnterpriseByCriteria(criteria)
            .then((resEnterprisePurchaseOrders: EnterprisePurchaseOrder[]) => {
                setEnterprisePurchaseOrders(resEnterprisePurchaseOrders);
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

    const handleSearchPurchaseOrder = (criteria: EnterprisePurchaseOrderSearchCriteriaRequest) => {
        if (criteria.orderStatus == OrderStatus.ALL) {
            criteria.orderStatus = null;
        }
        getPurchaseOrderForCurrentEnterpriseByCriteria(criteria)
            .then((resEnterprisePurchaseOrders: EnterprisePurchaseOrder[]) => {
                setEnterprisePurchaseOrders(resEnterprisePurchaseOrders);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    if (isShow) {
        return (
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Order History"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <CustomerPurchaseOrderSearch
                        onSearchPurchaseOrder={(criteria: EnterprisePurchaseOrderSearchCriteriaRequest) => handleSearchPurchaseOrder(criteria)}/>
                    {
                        currentEnterprise && (
                            <CustomerPurchaseOrderList enterprisePurchaseOrders={enterprisePurchaseOrders}
                                                       currentEnterprise={currentEnterprise}/>
                        )
                    }
                </Box>
            </Box>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }

}

export default EnterprisePurchaseOrderManagementPage;