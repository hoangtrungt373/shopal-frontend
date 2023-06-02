import {Autocomplete, Box, LinearProgress, LinearProgressProps, Stack, Tooltip} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef, GridToolbar} from "@mui/x-data-grid-premium";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import Button from "@mui/material/Button";
import {CustomerAllInfo} from "../../../model/admin/CustomerAllInfo";
import {getCustomerAllInfoByCriteria, syncCustomerPoint} from "../../../service/customer.service";
import {CustomerSearchCriteriaRequest} from "../../../model/request/CustomerSearchCriteriaRequest";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {AdminRouter, AssetPath} from "../../../config/router";
import {useForm} from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Enterprise} from "../../../model/Enterprise";
import {getAllEnterprise} from "../../../service/enterprise.service";
import {AbstractFilter} from "../../../model/AbstractFilter";
import Avatar from "@mui/material/Avatar";
import {createSeoLink} from "../../../util/display.util";
import {useHistory} from "react-router-dom";
import {CustomerSyncInfoRequest} from "../../../model/request/CustomerSyncInfoRequest";

interface Props {
    customerAllInfos?: CustomerAllInfo[],
    onSearchCustomer?: Function,
    enterpriseFilters?: AbstractFilter[]
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Customer",
        isLasted: true
    },
]

const CustomerSearch: React.FC<Props> = ({onSearchCustomer, enterpriseFilters}) => {

    const {
        register,
        setValue,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm<CustomerSearchCriteriaRequest>();
    const [selectedEnterprises, setSelectedEnterprises] = useState<AbstractFilter[]>([]);

    const onSubmit = handleSubmit(data => {
        // TODO: handle search for other criteria too
        let criteria: CustomerSearchCriteriaRequest = {
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            customerPhoneNumber: data.customerPhoneNumber,
            associateEnterpriseIds: [...selectedEnterprises.map(x => x.value)]
        }
        onSearchCustomer(criteria);
    });

    const handleChangeSelectedEnterprises = (e, value) => {
        setSelectedEnterprises([...value])
    }

    const handleClearFilter = () => {
        reset();
        setSelectedEnterprises([]);
        let criteria: CustomerSearchCriteriaRequest = {}
        onSearchCustomer(criteria);
    }

    return (
        <Box sx={{display: "flex", gap: 2}}>
            <form onSubmit={onSubmit} style={{width: "100%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography gutterBottom>Name</Typography>
                        <TextField {...register("customerName")} fullWidth size={"small"}
                                   placeholder={"Customer Name"}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom>Email</Typography>
                        <TextField {...register("customerEmail")} fullWidth size={"small"} type={"email"}
                                   placeholder={"Customer Email"}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom>Phone</Typography>
                        <TextField {...register("customerPhoneNumber")} fullWidth size={"small"}
                                   placeholder={"Customer Phone Number"} type={"number"}/>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography gutterBottom>
                            Enterprise
                        </Typography>
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={enterpriseFilters}
                            value={selectedEnterprises}
                            onChange={handleChangeSelectedEnterprises}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size={"small"}
                                    placeholder="Associate Enterprises"
                                />
                            )}
                        />
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

const CustomerAllInfoTable: React.FC<Props> = ({customerAllInfos}) => {

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
            headerName: 'Point List',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                /*TODO: use lan en vn*/
                return (
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                        {
                            params.row.membershipPoints.map((customerPoint, index) => (
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
                    onClick={() => history.push(AdminRouter.customerManagementPage + "/" + createSeoLink(params.row.fullName + "-" + params.row.contactEmail) + "." + params.id)}
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


const AdminCustomerManagementPage: React.FC<Props> = ({}) => {

    const [customerAllInfos, setCustomerAllInfos] = useState<CustomerAllInfo[]>([]);
    const [enterpriseFilters, setEnterpriseFilters] = useState<AbstractFilter[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [sync, setSync] = useState<any>({
        isSync: false,
        isDone: false,
        progress: 10,
        label: "Sync customer info"
    });
    const [searchCriteria, setSearchCriteria] = useState<CustomerSearchCriteriaRequest>();

    useEffect(() => {
        let criteria: CustomerSearchCriteriaRequest = {}
        getCustomerAllInfoByCriteria(criteria)
            .then((resCustomerAllInfos: CustomerAllInfo[]) => {
                setCustomerAllInfos(resCustomerAllInfos);
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
        document.title = "Admin - Customers"
    }, []);

    const handleSearchCustomer = async (criteria: CustomerSearchCriteriaRequest) => {
        setSearchCriteria(criteria);
        getCustomerAllInfoByCriteria(criteria)
            .then((resCustomerAllInfos: CustomerAllInfo[]) => {
                setCustomerAllInfos([...resCustomerAllInfos]);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    const handleSync = () => {
        let syncCustomerRequests: CustomerSyncInfoRequest[] = [];
        customerAllInfos.forEach((customer) => {
            customer.membershipPoints.forEach((membership) => {
                syncCustomerRequests.push({
                    customerId: customer.id,
                    enterpriseId: membership.enterpriseId,
                    membershipId: membership.membershipId
                })
            })
        });
        syncCustomerPoint(syncCustomerRequests)
            .then((res: string) => {
                console.log(res);
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
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
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Customer"}/>
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
                    <CustomerSearch enterpriseFilters={enterpriseFilters}
                                    onSearchCustomer={(criteria: CustomerSearchCriteriaRequest) => handleSearchCustomer(criteria)}/>
                </Box>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <CustomerAllInfoTable customerAllInfos={customerAllInfos}/>
                </Box>
            </Stack>
        );
    } else {
        return (
            <PageSpinner/>
        )
    }

}

export default AdminCustomerManagementPage;