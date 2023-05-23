import * as React from "react";
import {useState} from "react";
import {Box, InputAdornment, Stack} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {CustomerLoginHeader} from "../../common/customer/CustomerLoginHeader";
import {checkEmailExists, handleUserRegister, sendVerifyEmail} from "../../../service/auth.service";
import Button from "@mui/material/Button";
import PageSpinner from "../../common/share/PageSpinner";
import {CustomerRouter} from "../../../config/router";
import {Link} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {AuthenticationRequest} from "../../../model/request/AuthenticationRequest";
import {isBlank, isNotBlank} from "../../../util/string.util";
import {ErrorText} from "../../common/share/ErrorText";
import {UserRole} from "../../../model/enums/UserRole";
import {AuthenticationResponse} from "../../../model/AuthenticationResponse";

interface Props {
}

const initialError: AuthenticationRequest = {
    conformPassword: undefined,
    email: undefined,
    guiOtp: "",
}

const CustomerRegisterPage: React.FC<Props> = () => {

    const [isShow, setIsShow] = useState<boolean>(true);

    // form field
    const [data, setData] = useState<AuthenticationRequest>({
        guiOtp: "",
        role: UserRole.CUSTOMER
    });

    // form error display
    const [errors, setErrors] = useState<AuthenticationRequest>(initialError);

    // form password display
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const [isShowConformPassword, setIsShowConformPassword] = useState<boolean>(false);

    // register step;
    const [isShowEmailVerify, setIsShowEmailVerify] = useState<boolean>(false);

    const moveToVerifyEmail = () => {
        if (data.conformPassword != undefined && data.password != data.conformPassword) {
            setErrors(prev => ({...prev, conformPassword: "Mật khẩu không khớp"}))
        } else {
            setErrors(initialError);
            checkEmailExists(data.email)
                .then((res: any) => {
                    if (res) {
                        setErrors(prev => ({...prev, email: "Email đã tồn tại"}))
                    } else {
                        setData(prev => ({...prev, guiOtp: ""}));
                        setErrors(initialError);
                        setIsShowEmailVerify(true);
                        sendVerifyEmail(data.email)
                            .then((res1: string) => setData(prev => ({...prev, serverOtp: res1})))
                            .catch((err: ExceptionResponse) => console.log(err));
                    }
                })
        }
    };

    const moveToRegister = () => {
        setData(prev => ({...prev, guiOtp: ""}));
        setIsShowEmailVerify(false)
    }

    const handleVerify = () => {
        if (data.serverOtp != data.guiOtp) {
            setErrors(prev => ({...prev, guiOtp: "Mã OTP không chính xác"}))
        } else {
            handleUserRegister(data)
                .then((res: AuthenticationResponse) => {
                    console.log(res);
                    window.location.pathname = CustomerRouter.homePage;
                }).catch((err: ExceptionResponse) => {
                console.log(err);
            })
        }
    }

    const handleClickShowPassword = () => setIsShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickShowConformPassword = () => setIsShowConformPassword((show) => !show);

    const handleMouseDownConformPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    if (isShow) {
        return (
            <Box>
                <CustomerLoginHeader title={"Đăng kí"}/>
                <Stack direction={"row"} bgcolor={"#fff"} p={"40px 194px"} justifyContent={"space-content"}
                       alignItems={"center"}>
                    <Stack spacing={1} style={{width: "48%"}}>
                        <Typography variant={"h4"} color={"var(--bluebreak-600)"}>Shopal</Typography>
                        <Typography fontSize={"18px"}>Nền tảng thương mại thương điện tử yêu thích tại Việt
                            Nam</Typography>
                        <img style={{width: "400px", margin: "24px 0", display: "block"}}
                             src={"https://blog.usetada.com/hs-fs/hubfs/Tips%20to%20Increase%20Repeat%20Purchase%20(1).jpg?width=2400&name=Tips%20to%20Increase%20Repeat%20Purchase%20(1).jpg"}/>
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
                            isShowEmailVerify ? (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography>Mã Otp đã được gửi đển email <span
                                            style={{color: "var(--red-600)"}}>{data.email}</span>. Vui lòng kiểm
                                            tra hộp
                                            thư đến và lấy mã</Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{position: "relative"}}>
                                        <TextField
                                            value={data.guiOtp}
                                            fullWidth onChange={(e) => setData(prev => ({
                                            ...prev,
                                            guiOtp: e.target.value
                                        }))}
                                            placeholder={"Otp"}/>
                                        <ErrorText text={errors.guiOtp}
                                                   style={{
                                                       position: "absolute",
                                                       bottom: "-22px",
                                                       fontSize: "13px",
                                                       color: isNotBlank(errors.guiOtp) ? "var(--red-600)" : "transparent"
                                                   }}/>
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
                                <Grid container spacing={3}>
                                    <Grid item xs={12} style={{position: "relative"}}>
                                        <TextField
                                            value={data.email}
                                            onChange={(e) => setData(prev => ({...prev, email: e.target.value}))}
                                            fullWidth
                                            placeholder={"Email"} type={"email"}/>
                                        <ErrorText text={errors.email}
                                                   style={{
                                                       position: "absolute",
                                                       bottom: "-22px",
                                                       fontSize: "13px",
                                                       color: isNotBlank(errors.email) ? "var(--red-600)" : "transparent"
                                                   }}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            value={data.password}
                                            fullWidth
                                            onChange={(e) => setData(prev => ({...prev, password: e.target.value}))}
                                            type={isShowPassword ? "text" : "password"}
                                            InputProps={{
                                                endAdornment:
                                                    <InputAdornment position={"end"}>
                                                        <IconButton
                                                            disableRipple
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {isShowPassword ? <VisibilityOff/> : <Visibility/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                            }}
                                            placeholder={"Mật khẩu"}/>
                                    </Grid>
                                    <Grid item xs={12} style={{position: "relative"}}>
                                        <TextField
                                            value={data.conformPassword}
                                            fullWidth
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                conformPassword: e.target.value
                                            }))}
                                            type={isShowConformPassword ? "text" : "password"}
                                            InputProps={{
                                                endAdornment:
                                                    <InputAdornment position={"end"}>
                                                        <IconButton
                                                            disableRipple
                                                            onClick={handleClickShowConformPassword}
                                                            onMouseDown={handleMouseDownConformPassword}
                                                            edge="end"
                                                        >
                                                            {isShowConformPassword ? <VisibilityOff/> :
                                                                <Visibility/>}
                                                        </IconButton>
                                                    </InputAdornment>
                                            }}
                                            placeholder={"Xác nhận mật khẩu "}/>
                                        <ErrorText text={errors.conformPassword}
                                                   style={{
                                                       position: "absolute",
                                                       bottom: "-22px",
                                                       fontSize: "13px",
                                                       color: isNotBlank(errors.conformPassword) ? "var(--red-600)" : "transparent"
                                                   }}/>
                                    </Grid>
                                    <Grid item xs={12} mt={2}>
                                        <Button onClick={() => moveToVerifyEmail()} variant={"contained"} size={"large"}
                                                disabled={isBlank(data.password) || isBlank(data.conformPassword) || isBlank(data.email)}
                                                fullWidth
                                        >ĐĂNG KÍ</Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color={"var(--neutralgray-600)"} align={"center"}>Bạn đã có tài
                                            khoản? <Link
                                                to={CustomerRouter.loginPage} style={{color: "#EE4D2D"}}>Đăng
                                                nhập</Link></Typography>
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

export default CustomerRegisterPage;