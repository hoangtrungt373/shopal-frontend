import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Chip, Stack} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import {EnterpriseRegisterRequestAnn} from "../../../model/admin/EnterpriseRegisterRequestAnn";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {useHistory} from "react-router-dom";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import {getAllEnterpriseRegisterRequest} from "../../../service/enterprise.service";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {EnterpriseRegisterRequestStatus} from "../../../model/enums/EnterpriseRegisterRequestStatus";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";


interface Props {
    requests: EnterpriseRegisterRequestAnn[],
    onClickDetail?: Function
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Yêu cầu hợp tác",
        isLasted: true
    }
]

interface ChipStyle {
    chipBgColor: string,
    chipTextColor: string,
}

const getChipStyle = (status: EnterpriseRegisterRequestStatus) => {
    let chipBgColor = null;
    let chipTextColor = "#212121";
    switch (status) {
        case EnterpriseRegisterRequestStatus.RECEIVED: {
            chipBgColor = "#8A909D";
            chipTextColor = "#fff";
            break;
        }
        case EnterpriseRegisterRequestStatus.ACCEPT: {
            chipBgColor = "#13CAE1";
            chipTextColor = "#fff";
            break;
        }
        case EnterpriseRegisterRequestStatus.VERIFIED: {
            chipBgColor = "#29CC97";
            chipTextColor = "#fff";
            break;
        }
        case EnterpriseRegisterRequestStatus.REFUSE: {
            chipBgColor = "#F44336";
            break;
        }
        default: {
            break;
        }
    }
    return {
        chipBgColor,
        chipTextColor
    }
}


const RequestList: React.FC<Props> = ({requests, onClickDetail}) => {

    const history = useHistory();

    /*TODO: implement pagination*/
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 0.3
        },
        {
            field: 'enterpriseName',
            headerName: 'Doanh nghiệp',
            flex: 0.5,
        },
        {
            field: 'registerDate',
            headerName: 'Ngày đăng ký',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.registerDate.slice(0, 10)}</Typography>
                );
            }
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                let requestStatus: EnterpriseRegisterRequestStatus = params.row.registerRequestStatus;
                let chipStyle: ChipStyle = getChipStyle(requestStatus);

                return (
                    <Chip label={params.row.registerRequestStatus} size={"small"}
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
                    onClick={() => onClickDetail(params.id)}
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

const AdminEnterpriseRegisterRequestManagementPage: React.FC<Props> = ({}) => {

    const [enterpriseRegisterRequests, setEnterpriseRegisterRequests] = useState<EnterpriseRegisterRequestAnn[]>()
    const [isShow, setIsShow] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<EnterpriseRegisterRequestAnn>();

    const {
        register,
        setValue,
        handleSubmit,
        reset,
        getValues,
        formState: {errors}
    } = useForm<EnterpriseRegisterRequestAnn>();

    useEffect(() => {
        getAllEnterpriseRegisterRequest()
            .then((resRequests: EnterpriseRegisterRequestAnn[]) => {
                setEnterpriseRegisterRequests(resRequests);
                if (resRequests.length > 0) {
                    setSelectedRequest(resRequests[0]);
                    setFormValue(resRequests[0])
                }
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        }).finally(() => {
            setIsShow(true);
        })
    }, []);

    const handleClickDetail = (requestId: number) => {
        let newSelectedRequest = enterpriseRegisterRequests.find(x => x.id == requestId);
        setSelectedRequest(newSelectedRequest);
        setFormValue(newSelectedRequest);
    }

    const setFormValue = (request: EnterpriseRegisterRequestAnn) => {
        setValue("fullName", request.fullName);
        setValue("position", request.position);
        setValue("workEmail", request.workEmail);
        setValue("phoneNumber", request.phoneNumber);
        setValue("enterpriseAddress", request.enterpriseAddress);
        setValue("enterpriseName", request.enterpriseName);
        setValue("enterpriseWebsite", request.enterpriseWebsite);
    }

    const onSubmit = handleSubmit(data => {
        console.log(data)
    });


    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Yêu cầu hợp tác"}/>
                <Stack direction="row" spacing={2}>
                    <Box sx={{width: "50%", display: "flex", flexDirection: "column", gap: 2}}
                         className={"content-box"}>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                            <Chip label={selectedRequest.registerRequestStatus} size={"small"}
                                  style={{
                                      backgroundColor: getChipStyle(selectedRequest.registerRequestStatus).chipBgColor,
                                      color: getChipStyle(selectedRequest.registerRequestStatus).chipTextColor
                                  }}/>
                            <Typography className={"page-sub-header"}>{selectedRequest.enterpriseName}</Typography>
                        </Box>
                        <Divider/>
                        <form onSubmit={onSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>Họ và tên </Typography>
                                    <TextField
                                        {...register("fullName")}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>Chức vụ</Typography>
                                    <TextField
                                        {...register("position")}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={8} style={{position: "relative"}}>
                                    <Typography gutterBottom>Email công ty</Typography>
                                    <TextField
                                        {...register("workEmail")}
                                        fullWidth
                                        size={"small"}
                                        type={"email"}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>Số điện thoại</Typography>
                                    <TextField
                                        {...register("phoneNumber")}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography gutterBottom>Địa chỉ công ty</Typography>
                                    <TextField
                                        fullWidth
                                        {...register("enterpriseAddress")}
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography gutterBottom>Tên công ty</Typography>
                                    <TextField
                                        {...register("enterpriseName")}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography gutterBottom>Địa chỉ website</Typography>
                                    <TextField
                                        {...register("enterpriseWebsite")}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type={"submit"} variant={"contained"} fullWidth>Chấp nhận</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type={"submit"} variant={"outlined"} fullWidth>Yêu cầu thêm thông
                                        tin</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                    <Box sx={{width: "50%", display: "flex", flexDirection: "column", gap: 2}}
                         className={"content-box"}>
                        <RequestList requests={enterpriseRegisterRequests}
                                     onClickDetail={(id: number) => handleClickDetail(id)}/>
                    </Box>
                </Stack>
            </Stack>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminEnterpriseRegisterRequestManagementPage;