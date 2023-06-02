import {Box, Stack} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef, GridToolbar} from "@mui/x-data-grid-premium";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import Button from "@mui/material/Button";
import {CustomerSearchCriteriaRequest} from "../../../model/request/CustomerSearchCriteriaRequest";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {AssetPath} from "../../../config/router";
import {useForm} from "react-hook-form";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Enterprise} from "../../../model/Enterprise";
import {getEnterpriseByCriteria} from "../../../service/enterprise.service";
import {useHistory} from "react-router-dom";
import {EnterpriseSearchCriteriaRequest} from "../../../model/request/EnterpriseSearchCriteriaRequest";

interface Props {
    enterprises?: Enterprise[],
    onSearchEnterprise?: Function,
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Enterprise",
        isLasted: true
    },
]

const EnterpriseSearch: React.FC<Props> = ({onSearchEnterprise}) => {

    const {
        register,
        setValue,
        reset,
        handleSubmit,
        formState: {errors}
    } = useForm<EnterpriseSearchCriteriaRequest>();

    const onSubmit = handleSubmit(data => {
        // TODO: handle search for other criteria too
        let criteria: EnterpriseSearchCriteriaRequest = {
            phoneNumber: data.phoneNumber,
            address: data.address,
            contactEmail: data.contactEmail,
            taxId: data.taxId,
        }
        onSearchEnterprise(criteria);
    });

    const handleClearFilter = () => {
        reset();
        let criteria: EnterpriseSearchCriteriaRequest = {}
        onSearchEnterprise(criteria);
    }

    return (
        <Box sx={{display: "flex", gap: 2}}>
            <form onSubmit={onSubmit} style={{width: "100%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography gutterBottom>Phone Number</Typography>
                        <TextField {...register("phoneNumber")} fullWidth size={"small"}
                                   placeholder={"Enterprise Phone Number"}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom>Email</Typography>
                        <TextField {...register("contactEmail")} fullWidth size={"small"}
                                   placeholder={"Enterprise Contact Email"}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography gutterBottom>Tax Id</Typography>
                        <TextField {...register("taxId")} fullWidth size={"small"} placeholder={"Enterprise TaxId"}/>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography gutterBottom>Address</Typography>
                        <TextField {...register("address")} fullWidth size={"small"}
                                   placeholder={"Enterprise Address"}/>
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

const EnterpriseList: React.FC<Props> = ({enterprises}) => {

    const history = useHistory();

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'logoUrl',
            headerName: 'Logo',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                return (
                    <img alt="img" onError={(e) => {
                        // @ts-ignore
                        e.target.src = AssetPath.avatarDefaultImg
                    }}
                         src={`${AssetPath.enterpriseLogoUrl}${params.row.logoUrl}`}
                         style={{width: 50, height: 50, display: "block"}}/>
                );
            }
        },
        {
            field: 'enterpriseName',
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
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={enterprises}
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


const AdminEnterpriseManagementPage: React.FC<Props> = ({}) => {

    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [searchCriteria, setSearchCriteria] = useState<EnterpriseSearchCriteriaRequest>();

    useEffect(() => {
        let criteria: EnterpriseSearchCriteriaRequest = {}
        getEnterpriseByCriteria(criteria)
            .then((resEnterprises: Enterprise[]) => {
                setEnterprises(resEnterprises);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            }).finally(() => {
            setIsShow(true);
        })
        document.title = "Admin - Enterprises"
    }, []);

    const handleSearchEnterprise = async (criteria: EnterpriseSearchCriteriaRequest) => {
        setSearchCriteria(criteria);
        getEnterpriseByCriteria(criteria)
            .then((resEnterprises: Enterprise[]) => {
                setEnterprises([...resEnterprises]);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }


    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Enterprise"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <EnterpriseSearch
                        onSearchEnterprise={(criteria: CustomerSearchCriteriaRequest) => handleSearchEnterprise(criteria)}/>
                </Box>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <EnterpriseList enterprises={enterprises}/>
                </Box>
            </Stack>
        );
    } else {
        return (
            <PageSpinner/>
        )
    }

}

export default AdminEnterpriseManagementPage;