import * as React from "react";
import {useState} from "react";
import {Alert, Box, Stack} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {CustomerLoginHeader} from "../../common/customer/CustomerLoginHeader";
import {checkEmailExists, sendVerifyEmail} from "../../../service/auth.service";
import Button from "@mui/material/Button";
import PageSpinner from "../../common/share/PageSpinner";
import {EnterpriseRouter} from "../../../config/router";
import {Link} from "react-router-dom";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {AuthenticationRequest} from "../../../model/request/AuthenticationRequest";
import {isBlank, isNotBlank} from "../../../util/string.util";
import {ErrorText} from "../../common/share/ErrorText";
import {EnterpriseRegisterRequest} from "../../../model/enterprise/EnterpriseRegisterRequest";
import {handleReceiveEnterpriseRegisterRequest} from "../../../service/enterprise.service";

interface Props {
}

const initialError: AuthenticationRequest = {
    conformPassword: undefined,
    email: undefined,
    guiOtp: "",
}

const EnterpriseRegisterPage: React.FC<Props> = () => {

    const [isShow, setIsShow] = useState<boolean>(true);

    // form field
    const [data, setData] = useState<EnterpriseRegisterRequest>({
        guiOtp: "",
    });

    // form error display
    const [errors, setErrors] = useState<EnterpriseRegisterRequest>(initialError);

    // register step;
    const [isShowEmailVerify, setIsShowEmailVerify] = useState<boolean>(false);
    const [isShowVerifySuccess, setIsShowVerifySuccess] = useState<boolean>(false);

    const moveToVerifyEmail = () => {
        checkEmailExists(data.workEmail)
            .then((res: any) => {
                if (res) {
                    setErrors(prev => ({...prev, workEmail: "Email đã tồn tại"}))
                } else {
                    setData(prev => ({...prev, guiOtp: ""}));
                    setErrors(initialError);
                    setIsShowEmailVerify(true);
                    sendVerifyEmail(data.workEmail)
                        .then((res1: string) => setData(prev => ({...prev, serverOtp: res1})))
                        .catch((err: ExceptionResponse) => console.log(err));
                }
            })
    };

    const moveToRegister = () => {
        setData(prev => ({...prev, guiOtp: ""}));
        setIsShowEmailVerify(false)
    }

    const handleVerify = () => {
        if (data.serverOtp != data.guiOtp) {
            setErrors(prev => ({...prev, guiOtp: "Mã OTP không chính xác"}))
        } else {
            handleReceiveEnterpriseRegisterRequest(data)
                .then((res: string) => {
                    setIsShowVerifySuccess(true);
                }).catch((err: ExceptionResponse) => {
                console.log(err)
            })
        }
    }

    if (isShow) {
        return (
            <Box>
                <CustomerLoginHeader title={"Kênh Doanh Nghiệp"}/>
                <Stack direction={"row"} p={"40px 194px"} margin={"0px auto"} bgcolor={"#fff"}
                       alignItems={"center"}
                       justifyContent={"space-content"}
                >
                    <Stack spacing={1} style={{width: "48%"}}>
                        <Typography variant={"h4"} color={"var(--bluebreak-600)"}>Bán hàng chuyên nghiệp</Typography>
                        <Typography fontSize={"18px"}>Quản lý shop của bạn một cách hiệu quả hơn trên Shopal với Shoal -
                            Kênh doanh nghiệp</Typography>
                        <img style={{width: "400px", margin: "24px 0", display: "block"}}
                             src={"https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/1ca4b84d90ef19f5819f6e1579c3835a.png"}/>
                    </Stack>
                    <Box
                        style={{
                            width: "48%",
                            marginLeft: "auto",
                            backgroundColor: "#fff",
                            padding: "32px",
                            borderRadius: "8px",
                            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.03)",
                            border: "1px solid var(--neutralgray-400)"
                        }}>
                        <Typography variant={"h6"} mb={3}>Đăng kí</Typography>
                        {
                            isShowVerifySuccess ? (
                                <Box>
                                    <Alert severity="success">Cảm ơn bạn đã gửi thông tin liên hệ, chúng tôi sẽ tiến
                                        hành xét duyệt hồ sơ và gửi kết quả về email: {data.workEmail}</Alert>
                                </Box>
                            ) : isShowEmailVerify ? (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography>Mã Otp đã được gửi đển email <span
                                            style={{color: "var(--red-600)"}}>{data.workEmail}</span>. Vui lòng kiểm
                                            tra hộp
                                            thư đến và lấy mã</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            value={data.guiOtp}
                                            fullWidth onChange={(e) => setData(prev => ({
                                            ...prev,
                                            guiOtp: e.target.value
                                        }))}
                                            placeholder={"Otp"}/>
                                    </Grid>
                                    <Grid item xs={12} mt={2}>
                                        <Button variant={"contained"} size={"large"} fullWidth
                                                disabled={isBlank(data.guiOtp)} onClick={() => handleVerify()}
                                        >XÁC NHẬN</Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color={"var(--neutralgray-600)"} align={"center"}>Thay đổi email
                                            đăng ký? <span
                                                style={{
                                                    color: "#EE4D2D",
                                                    cursor: "pointer"
                                                }} onClick={() => moveToRegister()}>Nhấn vào đây</span></Typography>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography gutterBottom>Họ và tên</Typography>
                                        <TextField
                                            value={data.fullName}
                                            onChange={(e) => setData(prev => ({...prev, fullName: e.target.value}))}
                                            fullWidth
                                            size={"small"}
                                            placeholder={"Hoang Trung"}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography gutterBottom>Chức vụ</Typography>
                                        <TextField
                                            value={data.position}
                                            onChange={(e) => setData(prev => ({...prev, position: e.target.value}))}
                                            fullWidth
                                            size={"small"}
                                            placeholder={"HR Manager"}/>
                                    </Grid>
                                    <Grid item xs={7} style={{position: "relative"}}>
                                        <Typography gutterBottom>Email công ty</Typography>
                                        <TextField
                                            value={data.workEmail}
                                            onChange={(e) => setData(prev => ({...prev, workEmail: e.target.value}))}
                                            fullWidth
                                            size={"small"}
                                            type={"email"}
                                            error={isNotBlank(errors.workEmail)}
                                            placeholder={"hoangtrung@shopal.com"}/>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography gutterBottom>Số điện thoại</Typography>
                                        <TextField
                                            value={data.phoneNumber}
                                            onChange={(e) => setData(prev => ({...prev, phoneNumber: e.target.value}))}
                                            fullWidth
                                            size={"small"}
                                            placeholder={"0359569985"}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography gutterBottom>Địa chỉ công ty</Typography>
                                        <TextField
                                            fullWidth
                                            value={data.enterpriseAddress}
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                enterpriseAddress: e.target.value
                                            }))}
                                            size={"small"}
                                            placeholder={"160 Bùi Thị Xuân, Phường Phạm Ngũ Lão, Quận 1, Tp.Hồ Chí Minh"}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography gutterBottom>Tên công ty</Typography>
                                        <TextField
                                            value={data.enterpriseName}
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                enterpriseName: e.target.value
                                            }))}
                                            fullWidth
                                            size={"small"}
                                            placeholder={"PHUCLONG"}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography gutterBottom>Địa chỉ website</Typography>
                                        <TextField
                                            value={data.enterpriseWebsite}
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                enterpriseWebsite: e.target.value
                                            }))}
                                            fullWidth
                                            size={"small"}
                                            placeholder={"https://www.circlek.com.vn/vi/"}/>
                                    </Grid>
                                    <Grid item xs={12}
                                          sx={{display: "flex", gap: 2, alignItems: "center", position: "relative"}}>
                                        <Button onClick={() => moveToVerifyEmail()} variant={"contained"}
                                                disabled={isBlank(data.enterpriseWebsite) || isBlank(data.enterpriseName) || isBlank(data.enterpriseAddress) ||
                                                    isBlank(data.phoneNumber) || isBlank(data.workEmail) || isBlank(data.position) || isBlank(data.fullName)}
                                        >Liên hệ ngay</Button>
                                        <Typography>Đã có tài khoản doanh nghiệp? <Link
                                            to={EnterpriseRouter.loginPage}
                                            style={{color: "#EE4D2D"}}>Đăng nhập</Link></Typography>
                                        <ErrorText text={errors.workEmail}
                                                   style={{
                                                       position: "absolute",
                                                       bottom: "-22px",
                                                       left: "18px",
                                                       fontSize: "13px",
                                                       color: isNotBlank(errors.workEmail) ? "var(--red-600)" : "transparent"
                                                   }}/>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </Box>
                </Stack>
            </Box>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default EnterpriseRegisterPage;