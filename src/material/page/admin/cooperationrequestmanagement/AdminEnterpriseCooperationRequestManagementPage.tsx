import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Chip} from "@mui/material";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import {EnterpriseCooperationRequest} from "../../../model/admin/EnterpriseCooperationRequest";
import {getAllEnterpriseCooperationRequest} from "../../../service/enterprise.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {Link, useHistory} from "react-router-dom";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import {CatalogStatus} from "../../../model/enums/CatalogStatus";
import {ProductTrendingState} from "../../../model/enums/ProductTrendingState";


interface Props {
    requests: EnterpriseCooperationRequest[],
    onClickDetail?: Function
}


const RequestList: React.FC<Props> = ({requests}) => {

    const history = useHistory();

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.3
        },
        {
            field: 'enterpriseName',
            headerName: 'Name',
            flex: 0.7
        },
        {
            field: 'enterpriseWebsite',
            headerName: 'Website',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                return (
                    <Link to={params.row.enterpriseWebsite}>{params.row.enterpriseWebsite}</Link>
                );
            }
        },
        {
            field: 'totalProduct',
            headerName: 'Product',
            flex: 0.3
        },
        {
            field: 'totalSell',
            headerName: 'Total Sell',
            flex: 0.3
        },
        {
            field: 'catalogStatus',
            headerName: 'Status',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                let catalogStatus: CatalogStatus = params.row.catalogStatus;
                let chipBgColor = null;
                let chipTextColor = "#212121";
                switch (catalogStatus) {
                    case CatalogStatus.INACTIVE: {
                        chipBgColor = "#8A909D";
                        chipTextColor = "#fff";
                        break;
                    }
                    case CatalogStatus.ACTIVE: {
                        chipBgColor = "#29CC97";
                        chipTextColor = "#fff";
                        break;
                    }
                    default: {
                        break;
                    }
                }

                return (
                    <Chip label={params.row.catalogStatusDescription} size={"small"}
                          style={{backgroundColor: chipBgColor, color: chipTextColor}}/>
                );
            }
        },
        {
            field: 'productTrendingState',
            headerName: 'Trending',
            flex: 0.3,
            renderCell(params: GridCellParams) {

                let trending: ProductTrendingState = params.row.productTrendingState;
                let chipBgColor = null;
                let chipTextColor = "#212121";
                switch (trending) {
                    case ProductTrendingState.TOP: {
                        chipBgColor = "#29CC97";
                        chipTextColor = "#fff";
                        break;
                    }
                    case ProductTrendingState.MEDIUM: {
                        chipBgColor = "#88AAF3";
                        break;
                    }
                    case ProductTrendingState.LOW: {
                        chipBgColor = "#EC4A58";
                        chipTextColor = "#fff";
                        break;
                    }
                    default: {
                        break;
                    }
                }

                return (
                    <Chip label={params.row.productTrendingState} size={"small"}
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
                    label="Update Status"
                    showInMenu
                />,
                <GridActionsCellItem
                    label="Detail"
                    showInMenu
                    // onClick={() => onCLickDetail(params.id)}
                />,
            ],
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={requests}
                columns={columns}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                        },
                    },
                }}
                checkboxSelectionVisibleOnly={true}
            />
        </Box>
    )
}

const AdminEnterpriseCooperationRequestManagementPage: React.FC<Props> = ({}) => {

    const [enterpriseCooperationRequests, setEnterpriseCooperationRequests] = useState<EnterpriseCooperationRequest[]>()
    const [isShow, setIsShow] = useState<boolean>(false);

    useEffect(() => {
        getAllEnterpriseCooperationRequest()
            .then((resRequests: EnterpriseCooperationRequest[]) => {
                setEnterpriseCooperationRequests(resRequests);
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        }).finally(() => {
            setIsShow(true);
        })
        setIsShow(true);
    }, []);

    if (isShow) {
        return (
            <Box sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                <Typography variant={"h6"} fontWeight={"bold"}>Cooperation Request</Typography>
            </Box>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminEnterpriseCooperationRequestManagementPage;