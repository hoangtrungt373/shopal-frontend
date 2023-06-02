import {Box, Chip, Grid, MenuItem, Stack} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {getPurchaseOrderByCriteria} from "../../../service/order.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import PageSpinner from "../../common/share/PageSpinner";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef, GridToolbar} from "@mui/x-data-grid-premium";
import Typography from "@mui/material/Typography";
import {Customer} from "../../../model/Customer";
import {OrderStatus} from "../../../model/enums/OrderStatus";
import {useForm} from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useHistory} from "react-router-dom";
import {AdminRouter, AssetPath} from "../../../config/router";
import {createSeoLink, formatVndMoney, removeExtensionEmail} from "../../../util/display.util";
import Avatar from "@mui/material/Avatar";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {PurchaseOrder} from "../../../model/PurchaseOrder";
import {AbstractFilter} from "../../../model/AbstractFilter";
import {PurchaseOrderSearchCriteriaRequest} from "../../../model/request/PurchaseOrderSearchCriteriaRequest";
import {CustomerSearchCriteriaRequest} from "../../../model/request/CustomerSearchCriteriaRequest";


interface Props {
    purchaseOrders?: PurchaseOrder[],
    onSearchPurchaseOrder?: Function,
    enterpriseFilters?: AbstractFilter[]
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Orders",
        isLasted: true
    }
]

export const orderStatusOptions: AbstractFilter[] = [
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
    {
        label: "Cancelled",
        value: OrderStatus.CANCELLED
    },
];

const PurchaseOrderSearch: React.FC<Props> = ({onSearchPurchaseOrder}) => {

    const {
        register,
        setValue,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm<PurchaseOrderSearchCriteriaRequest>();
    const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>(OrderStatus.ALL);

    const onSubmit = handleSubmit(data => {
        let criteria: PurchaseOrderSearchCriteriaRequest = {
            orderDateFrom: data.orderDateFrom,
            orderDateTo: data.orderDateTo,
            orderStatus: selectedOrderStatus
        }
        onSearchPurchaseOrder(criteria);
    });

    const handleClearFilter = () => {
        reset();
        setSelectedOrderStatus(OrderStatus.ALL);
        let criteria: CustomerSearchCriteriaRequest = {}
        onSearchPurchaseOrder(criteria);
    }

    return (
        <Box sx={{display: "flex", gap: 2}}>
            <form onSubmit={onSubmit} style={{width: "100%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography gutterBottom>From date</Typography>
                        <TextField {...register("orderDateFrom")} type={"date"} size={"small"} fullWidth
                                   placeholder={"From date"}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom>To date</Typography>
                        <TextField {...register("orderDateTo")} type={"date"} size={"small"} fullWidth
                                   placeholder={"To date"}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom>Email</Typography>
                        <TextField {...register("customerContactEmail")} fullWidth size={"small"}
                                   placeholder={"Customer email"}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom>Phone number</Typography>
                        <TextField {...register("customerPhoneNumber")} fullWidth size={"small"}
                                   placeholder={"Customer phone number"}/>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography gutterBottom>Status</Typography>
                        <TextField
                            select
                            defaultValue={OrderStatus.ALL}
                            value={selectedOrderStatus}
                            onChange={(e) => setSelectedOrderStatus(e.target.value as OrderStatus)}
                            fullWidth size={"small"}
                        >
                            {orderStatusOptions.map((option) => (
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

const PurchaseOrderList: React.FC<Props> = ({purchaseOrders}) => {

    const history = useHistory();

    /*TODO: implement pagination*/
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.3
        },
        {
            field: 'customer',
            headerName: 'Customer',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.customer.fullName}</Typography>
                );
            }
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 0.7,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.customer.contactEmail}</Typography>
                );
            }
        },
        {
            field: 'orderTotalItems',
            headerName: 'Items',
            flex: 0.3
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
                                src={AssetPath.enterpriseLogoUrl + params.row.enterprise.logoUrl}
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
            flex: 0.5,
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
                        chipTextColor = "#fff";
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
            flex: 0.3,
            valueGetter: ({value}) => value && value.slice(0, 10),
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
                    onClick={() => history.push(AdminRouter.purchaseOrderDetailPage + "/" + createSeoLink(removeExtensionEmail(params.row.customer.contactEmail)) + "." + params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={purchaseOrders}
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

const AdminPurchaseOrderManagementPage: React.FC<Props> = ({}) => {

    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>();
    const [isShow, setIsShow] = useState<boolean>(false);

    useEffect(() => {
        document.title = "Admin - Orders";
        getPurchaseOrderByCriteria({})
            .then((resPurchaseOrders: PurchaseOrder[]) => {
                setPurchaseOrders(resPurchaseOrders);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
            .finally(() => {
                setIsShow(true);
            });
    }, []);

    const handleSearchPurchaseOrder = (criteria: PurchaseOrderSearchCriteriaRequest) => {
        if (criteria.orderStatus == OrderStatus.ALL) {
            criteria.orderStatus = null;
        }
        getPurchaseOrderByCriteria(criteria)
            .then((resPurchaseOrders: PurchaseOrder[]) => {
                setPurchaseOrders(resPurchaseOrders);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Order History"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <PurchaseOrderSearch
                        onSearchPurchaseOrder={(criteria: PurchaseOrderSearchCriteriaRequest) => handleSearchPurchaseOrder(criteria)}/>
                </Box>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <PurchaseOrderList purchaseOrders={purchaseOrders}/>
                </Box>
            </Stack>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }

}

export default AdminPurchaseOrderManagementPage;