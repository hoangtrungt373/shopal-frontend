import {Box, Stack, Tooltip} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef, GridToolbar} from "@mui/x-data-grid-premium";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import Button from "@mui/material/Button";
import {CustomerAllInfo} from "../../../model/admin/CustomerAllInfo";
import {getCustomerAllInfoByCriteria} from "../../../service/customer.service";
import {CustomerSearchCriteriaRequest} from "../../../model/request/CustomerSearchCriteriaRequest";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {AssetPath, EnterpriseRouter} from "../../../config/router";
import {useForm} from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Enterprise} from "../../../model/Enterprise";
import Avatar from "@mui/material/Avatar";
import {createSeoLink} from "../../../util/other.util";
import {useHistory} from "react-router-dom";

interface Props {
    customerAllInfos?: CustomerAllInfo[],
    onSearchCustomer?: Function,
    currentEnterprise?: Enterprise
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Customer",
        isLasted: true
    },
]

const CustomerSearch: React.FC<Props> = ({onSearchCustomer}) => {

    const {
        register,
        setValue,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm<CustomerSearchCriteriaRequest>();

    const onSubmit = handleSubmit(data => {
        // TODO: handle search for other criteria too
        let criteria: CustomerSearchCriteriaRequest = {
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            customerPhoneNumber: data.customerPhoneNumber,
        }
        onSearchCustomer(criteria);
    });

    const handleClearFilter = () => {
        reset();
        let criteria: CustomerSearchCriteriaRequest = {}
        onSearchCustomer(criteria);
    }

    return (
        <Box sx={{display: "flex", gap: 2}}>
            <form onSubmit={onSubmit} style={{width: "100%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography gutterBottom>Name</Typography>
                        <TextField {...register("customerName")} fullWidth size={"small"}
                                   placeholder={"Customer Name"}/>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom>Email</Typography>
                        <TextField {...register("customerEmail")} fullWidth size={"small"} type={"email"}
                                   placeholder={"Customer Email"}/>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography gutterBottom>Phone</Typography>
                        <TextField {...register("customerPhoneNumber")} fullWidth size={"small"}
                                   placeholder={"Customer Phone Number"} type={"number"}/>
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

const CustomerAllInfoTable: React.FC<Props> = ({customerAllInfos, currentEnterprise}) => {

    const history = useHistory();

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'avatarUrl',
            headerName: 'Profile',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                return (
                    <img alt="img" onError={(e) => {
                        // @ts-ignore
                        e.target.src = AssetPath.avatarDefaultImg
                    }}
                         src={`${AssetPath.customerAvatarUrl}${params.row.avatarUrl}`}
                         style={{width: 50, height: 50, display: "block"}}/>
                );
            }
        },
        {
            field: 'fullName',
            headerName: 'Name',
            flex: 0.4,
        },
        {
            field: 'contactEmail',
            headerName: 'Email',
            flex: 0.4,
        },
        {
            field: 'phoneNumber',
            headerName: 'Phone',
            flex: 0.3,
        },
        {
            field: 'membershipPoints',
            headerName: 'Available Point',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                /*TODO: use lan en vn*/
                return (
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                        {
                            params.row.membershipPoints.filter(x => x.enterpriseId == currentEnterprise.id).map((customerPoint, index) => (
                                <Box sx={{display: "flex", gap: 0.5, alignItems: "center", flexWrap: "wrap"}}>
                                    <Typography>{customerPoint.availablePoint}</Typography>
                                    <Tooltip title={customerPoint.enterpriseName} key={index}>
                                        <Avatar alt="img"
                                                src={AssetPath.enterpriseLogoUrl + customerPoint.enterpriseLogoUrl}
                                                sx={{width: 15, height: 15}}/>
                                    </Tooltip>
                                </Box>

                            ))
                        }
                    </Box>
                );
            }
        },
        {
            field: 'totalBuy',
            headerName: 'Total Buy',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.membershipPoints.find(x => x.enterpriseId == currentEnterprise.id).totalBuy}</Typography>
                );
            }
        },
        {
            field: 'joinDate',
            headerName: 'Join On',
            flex: 0.3,
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
                    onClick={() => history.push(EnterpriseRouter.customerMembershipManagementPage + "/" + createSeoLink(params.row.fullName + "-" + params.row.contactEmail) + "." + params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={customerAllInfos}
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


const EnterpriseCustomerMembershipManagementPage: React.FC<Props> = ({currentEnterprise}) => {

    const [customerAllInfos, setCustomerAllInfos] = useState<CustomerAllInfo[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);

    useEffect(() => {
        let criteria: CustomerSearchCriteriaRequest = {associateEnterpriseIds: [currentEnterprise.id]}
        getCustomerAllInfoByCriteria(criteria)
            .then((resCustomerAllInfos: CustomerAllInfo[]) => {
                setCustomerAllInfos(resCustomerAllInfos);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            }).finally(() => {
            setIsShow(true);
        })
    }, []);

    const handleSearchCustomer = (criteria: CustomerSearchCriteriaRequest) => {
        criteria.associateEnterpriseIds = [currentEnterprise.id];
        getCustomerAllInfoByCriteria(criteria)
            .then((resCustomerAllInfos: CustomerAllInfo[]) => {
                setCustomerAllInfos([...resCustomerAllInfos]);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Customer"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <CustomerSearch
                        onSearchCustomer={(criteria: CustomerSearchCriteriaRequest) => handleSearchCustomer(criteria)}/>
                </Box>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <CustomerAllInfoTable customerAllInfos={customerAllInfos} currentEnterprise={currentEnterprise}/>
                </Box>
            </Stack>
        );
    } else {
        return (
            <PageSpinner/>
        )
    }

}

export default EnterpriseCustomerMembershipManagementPage;