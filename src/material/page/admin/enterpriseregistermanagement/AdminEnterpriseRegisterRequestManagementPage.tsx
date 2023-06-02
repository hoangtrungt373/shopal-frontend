import * as React from "react";
import {useEffect, useState} from "react";
import {Alert, Box, Chip, Stack} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import {EnterpriseRegisterRequestAnn} from "../../../model/admin/EnterpriseRegisterRequestAnn";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {useHistory} from "react-router-dom";
import {DataGridPremium, GridActionsCellItem, GridCellParams, GridColDef} from "@mui/x-data-grid-premium";
import {
    getAllEnterpriseRegisterRequest,
    handleAcceptEnterpriseCooperationRequest
} from "../../../service/enterprise.service";
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
        title: "Cooperation Request",
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
            headerName: 'Enterprise',
            flex: 0.5,
        },
        {
            field: 'registerDate',
            headerName: 'Register Date',
            flex: 0.5,
            renderCell(params: GridCellParams) {

                return (
                    <Typography>{params.row.registerDate.slice(0, 10)}</Typography>
                );
            }
        },
        {
            field: 'status',
            headerName: 'Status',
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
    const [showAlert, setShowAlert] = useState({
        open: false,
        content: null,
        severity: null
    });

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
        });
        document.title = "Admin - Enterprise Request";

    }, []);

    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            setShowAlert(prevState4 => ({
                ...prevState4,
                open: false,
            }));
        }, 3000)

        return () => {
            clearTimeout(timeId)
        }

    }, [showAlert]);

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
        handleAcceptEnterpriseCooperationRequest(selectedRequest)
            .then((res: string) => {
                let updateSelectedRequest: EnterpriseRegisterRequestAnn = selectedRequest;
                updateSelectedRequest.registerRequestStatus = EnterpriseRegisterRequestStatus.ACCEPT;
                setSelectedRequest(updateSelectedRequest);

                let updateEnterpriseRegisterRequests = [...enterpriseRegisterRequests];
                updateEnterpriseRegisterRequests.find(x => x.id == updateSelectedRequest.id).registerRequestStatus = EnterpriseRegisterRequestStatus.ACCEPT;
                setEnterpriseRegisterRequests([...updateEnterpriseRegisterRequests])

                setShowAlert(prevState4 => ({
                    ...prevState4,
                    open: true,
                    content: res,
                    severity: "success"
                }));
            }).catch((err: ExceptionResponse) => {
            if (err.status == 409) {
                setShowAlert(prevState4 => ({
                    ...prevState4,
                    open: true,
                    content: err.errorMessage,
                    severity: "error"
                }));
            }
        })
    });


    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Cooperation Request"}/>
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
                                    <Typography gutterBottom>Full Name</Typography>
                                    <TextField
                                        {...register("fullName")}
                                        fullWidth disabled={true}
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>Position</Typography>
                                    <TextField
                                        {...register("position")}
                                        fullWidth disabled={true}
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={8} style={{position: "relative"}}>
                                    <Typography gutterBottom>Email</Typography>
                                    <TextField
                                        {...register("workEmail")}
                                        fullWidth disabled={true}
                                        size={"small"}
                                        type={"email"}/>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography gutterBottom>Phone Number</Typography>
                                    <TextField
                                        {...register("phoneNumber")}
                                        fullWidth disabled={true}
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography gutterBottom>Address</Typography>
                                    <TextField
                                        fullWidth disabled={true}
                                        {...register("enterpriseAddress")}
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography gutterBottom>Enterprise Name</Typography>
                                    <TextField
                                        {...register("enterpriseName")}
                                        fullWidth disabled={true}
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography gutterBottom>Wensite</Typography>
                                    <TextField
                                        {...register("enterpriseWebsite")}
                                        fullWidth
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography gutterBottom>Tax ID</Typography>
                                    <TextField
                                        {...register("taxId")}
                                        fullWidth disabled={true}
                                        size={"small"}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button type={"submit"} variant={"contained"}
                                            color={selectedRequest.registerRequestStatus == EnterpriseRegisterRequestStatus.RECEIVED ? "primary" : "success"}
                                            fullWidth
                                            disabled={selectedRequest.registerRequestStatus == EnterpriseRegisterRequestStatus.ACCEPT}
                                    >{selectedRequest.registerRequestStatus == EnterpriseRegisterRequestStatus.RECEIVED ? "Accept" : "Accepted"}</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant={"outlined"} fullWidth
                                            disabled={selectedRequest.registerRequestStatus == EnterpriseRegisterRequestStatus.ACCEPT}
                                    >Request more info</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        showAlert.open && (
                                            <Alert severity={showAlert.severity}>{showAlert.content}</Alert>
                                        )
                                    }
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