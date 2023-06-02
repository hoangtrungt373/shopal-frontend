import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {EnterpriseMembership} from "../../../model/customer/EnterpriseMembership";
import {
    getEnterpriseMembershipForCurrentCustomer,
    handleRequestNewMembershipForCurrentCustomer
} from "../../../service/membership.service";
import Avatar from "@mui/material/Avatar";
import {AssetPath} from "../../../config/router";
import Button from "@mui/material/Button";
import SyncIcon from '@mui/icons-material/Sync';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Chip, MenuItem, Tooltip} from "@mui/material";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {useForm} from "react-hook-form";
import {CustomerNewMembershipRequest} from "../../../model/customer/CustomerNewMembershipRequest";
import {Enterprise} from "../../../model/Enterprise";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {getAllEnterprise} from "../../../service/enterprise.service";
import {AbstractFilter} from "../../../model/AbstractFilter";
import PageSpinner from "../../common/share/PageSpinner";
import AlertDialog from "../../common/share/AlertDialog";


interface Props {
    enterpriseMemberships?: EnterpriseMembership[],
    notRegisterEnterpriseOptions?: AbstractFilter[],
    onAddNewMembership?: Function
}


const EnterpriseMembershipList: React.FC<Props> = ({enterpriseMemberships}) => {

    const chipColors: string[] = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#52c41a"];

    /*TODO: add sync feature*/
    return (
        <Grid container spacing={2}>
            {
                enterpriseMemberships.map((enterpriseMembership, index1) => {

                    let chipColor = chipColors[Math.round((chipColors.length) / index1) - 1];
                    if (chipColor == undefined) {
                        chipColor = chipColors[0];
                    }

                    return (
                        <Grid item xs={3} key={"index"}>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                p: 2,
                                borderRadius: 2,
                                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.03)",
                                alignItems: "center",
                                border: "1px solid var(--neutralgray-400)"
                            }}>
                                <Avatar alt="img" variant={"rounded"}
                                        src={AssetPath.enterpriseLogoUrl + enterpriseMembership.enterprise.logoUrl}
                                        sx={{width: 100, height: 100}}/>
                                <Typography
                                    style={{
                                        color: "#56606e",
                                        fontWeight: "bold",
                                        fontSize: 16
                                    }}>{enterpriseMembership.enterprise.enterpriseName}</Typography>
                                <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                                    <Tooltip title={"Register email address"}>
                                        <EmailOutlinedIcon style={{fontSize: 14}}/>
                                    </Tooltip>
                                    <Typography fontSize={12}> {enterpriseMembership.registerEmail}</Typography>
                                </Box>
                                <Box sx={{display: "flex", gap: 1, alignItems: "center", mt: -1}}>
                                    <Tooltip title={"Register phone number"}>
                                        <PhoneOutlinedIcon style={{fontSize: 14}}/>
                                    </Tooltip>
                                    <Typography fontSize={12}>{enterpriseMembership.registerPhoneNumber}</Typography>
                                </Box>
                                <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                    <Tooltip title={"Available point"}>
                                        <Chip label={enterpriseMembership.availablePoint} style={{
                                            backgroundColor: chipColor,
                                            fontWeight: "bold",
                                            color: "#fff"
                                        }}/>
                                    </Tooltip>
                                    <Button variant="outlined" startIcon={<SyncIcon/>} size={"small"}
                                            style={{textTransform: "initial"}}>
                                        Sync info
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    )
                })
            }
        </Grid>
    )
}

const EnterpriseMembershipEmpty: React.FC<Props> = ({}) => {

    return (
        <Box sx={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 2,
            height: "350px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2
        }}>
            <img src={AssetPath.emptyEnterpriseImg} alt={"cart-empty"} width={"300px"}/>
            <Typography>Bạn chưa có thông tin thành viên của bất kì doanh nghiệp nào</Typography>
        </Box>
    )
}

const EnterpriseMembershipRequest: React.FC<Props> = ({notRegisterEnterpriseOptions, onAddNewMembership}) => {

    /*TODO: verify by otp*/
    const {
        register,
        setValue,
        reset,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm<CustomerNewMembershipRequest>();

    useEffect(() => {
        setValue("registerEmail", null);
        setValue("registerPhoneNumber", null);
    }, [])

    const onSubmit = handleSubmit(data => {
        let request: CustomerNewMembershipRequest = {
            registerEmail: data.registerEmail,
            registerPhoneNumber: data.registerPhoneNumber,
            enterpriseId: data.enterpriseId
        }
        onAddNewMembership(request);
    });

    return (
        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
            {
                notRegisterEnterpriseOptions && notRegisterEnterpriseOptions.length > 0 ? (
                    <form onSubmit={onSubmit} style={{width: "100%"}}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography gutterBottom>Email đăng ký</Typography>
                                <TextField {...register("registerEmail")} fullWidth size={"small"}
                                           type={"email"} placeholder={"Email đăng ký thành viên tại doanh nghiệp"}/>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography gutterBottom>Số điện thoại đăng ký</Typography>
                                <TextField {...register("registerPhoneNumber")} fullWidth
                                           size={"small"}
                                           placeholder={"Số điện thoại đăng ký thành viên tại doanh nghiệp"}
                                           type={"number"}/>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography gutterBottom>Doanh nghiệp</Typography>
                                <TextField
                                    select
                                    {...register("enterpriseId")} size={"small"}
                                    sx={{width: "100%"}}
                                >
                                    {notRegisterEnterpriseOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography gutterBottom style={{color: "transparent"}}>xxx</Typography>
                                <Button variant={"contained"} type={"submit"}
                                        style={{textTransform: "initial"}}>Tìm kiếm</Button>
                            </Grid>
                        </Grid>
                    </form>
                ) : (
                    <Typography>Bạn đã có tài khoản thành viên của tát cả các doanh nghiệp trong hệ thống, không thể
                        thêm mới</Typography>
                )
            }
        </Box>
    )
}

const CustomerMembershipPage: React.FC<Props> = () => {

    const [enterpriseMemberships, setEnterpriseMemberships] = useState<EnterpriseMembership[]>([]);
    const [notRegisterEnterpriseOptions, setNotRegisterEnterpriseOptions] = useState<AbstractFilter[]>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "",
        handleAccept: () => {
            setShowAlert(prevState2 => ({
                ...prevState2,
                open: false
            }));
        },
        handleDenied: () => {
            setShowAlert(prevState2 => ({
                ...prevState2,
                open: false
            }));
        }
    });

    useEffect(() => {
        getEnterpriseMembershipForCurrentCustomerFunc()
            .then(() => {
                setIsShow(true);
            })
    }, []);

    const DisplayAlert = () => {
        if (showAlert.open) {
            return (
                <AlertDialog
                    isOpen={showAlert.open} title={showAlert.title} handleDenied={showAlert.handleDenied}
                    handleAccept={showAlert.handleAccept}/>
            )
        } else {
            return null;
        }
    }

    const handleAddNewMembership = async (request: CustomerNewMembershipRequest) => {
        await handleRequestNewMembershipForCurrentCustomer(request)
            .then((res: string) => {
                setShowAlert(prevState2 => ({
                    ...prevState2,
                    open: true,
                    title: "Cập nhật thông tin thành viên thành công"
                }));
                getEnterpriseMembershipForCurrentCustomerFunc()
            }).catch((err: ExceptionResponse) => {
                if (err.status == 409) {
                    setShowAlert(prevState2 => ({
                        ...prevState2,
                        open: true,
                        title: "Không tìm thấy thông tin thành viên, vui lòng thử lại sau"
                    }));
                } else {
                    console.log(err);
                }
            })
    }

    const getEnterpriseMembershipForCurrentCustomerFunc = async () => {
        getEnterpriseMembershipForCurrentCustomer()
            .then((resEnterpriseMemberships: EnterpriseMembership[]) => {
                setEnterpriseMemberships(resEnterpriseMemberships);
                getAllEnterprise()
                    .then((resEnterprises: Enterprise[]) => {
                        let items: AbstractFilter[] = [];
                        resEnterprises.forEach(resEnterprise => {
                            if (resEnterpriseMemberships.findIndex(x => x.enterprise.id == resEnterprise.id) == -1) {
                                items.push({
                                    label: resEnterprise.enterpriseName,
                                    value: resEnterprise.id
                                });
                            }
                        })
                        console.log(items)
                        setNotRegisterEnterpriseOptions([...items]);
                    })
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
    }

    if (isShow) {
        return (
            <Box>
                <DisplayAlert/>
                <Typography variant={"h6"} mb={2}>Danh sách thành viên</Typography>
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mb: 2
                    }}>
                    <Typography fontSize={"16px"}>Không tìm thấy thông tin thành viên mà bạn đã đăng ký? Yêu cầu tìm
                        kiếm ngay đây</Typography>
                    <EnterpriseMembershipRequest notRegisterEnterpriseOptions={notRegisterEnterpriseOptions}
                                                 onAddNewMembership={(request: CustomerNewMembershipRequest) => handleAddNewMembership(request)}/>
                </Box>
                <Box
                    sx={{
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}>
                    <Typography fontSize={"16px"}>Danh sách thông tin thành viên mà bạn đã đăng ký</Typography>
                    {
                        enterpriseMemberships.length > 0 ? (
                            <EnterpriseMembershipList enterpriseMemberships={enterpriseMemberships}/>
                        ) : (
                            <EnterpriseMembershipEmpty/>
                        )
                    }
                </Box>
            </Box>
        );
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default CustomerMembershipPage;