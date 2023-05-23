import * as React from "react";
import {useState} from "react";
import {Box, InputAdornment, Stack} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {CustomerLoginHeader} from "../../common/customer/CustomerLoginHeader";
import {handleUserAuthenticate} from "../../../service/auth.service";
import Button from "@mui/material/Button";
import PageSpinner from "../../common/share/PageSpinner";
import {AdminRouter} from "../../../config/router";
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
    password: undefined,
    email: undefined,
}

const AdminLoginPage: React.FC<Props> = () => {

    const [isShow, setIsShow] = useState<boolean>(true);

    // form field
    const [data, setData] = useState<AuthenticationRequest>({
        role: UserRole.ADMIN
    });

    // form error display
    const [errors, setErrors] = useState<AuthenticationRequest>(initialError);

    // form password display
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

    const onSubmit = () => {
        handleUserAuthenticate(data)
            .then((res: AuthenticationResponse) => {
                window.location.pathname = AdminRouter.dashboardPage
            }).catch((err: ExceptionResponse) => {
            console.log(err);
            if (err.status == 401) {
                setErrors(prev => ({...prev, password: "Email hoặc Password không chính xác"}))
            } else {
            }
        })
    }

    const handleClickShowPassword = () => setIsShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    if (isShow) {
        return (
            <Box>
                <CustomerLoginHeader title={"Admin"}/>
                <Stack direction={"row"} p={"40px 194px"} justifyContent={"space-content"}
                       alignItems={"center"} bgcolor={"#fff"}>
                    <Stack spacing={1} style={{width: "48%"}}>
                        <Typography variant={"h4"} color={"var(--bluebreak-600)"}>Admin Dashboard</Typography>
                        <img style={{width: "400px", margin: "24px 0", display: "block"}}
                             src={"https://timviec365.vn/pictures/images_10_2021/cac-ky-nang-cua-hr-administrator.jpg"}/>
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
                        <Typography variant={"h6"} mb={3}>Đăng nhập</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} style={{position: "relative"}}>
                                <TextField
                                    value={data.email}
                                    onChange={(e) => setData(prev => ({...prev, email: e.target.value}))}
                                    fullWidth
                                    placeholder={"Email"} type={"email"}/>
                            </Grid>
                            <Grid item xs={12} style={{position: "relative"}}>
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
                                <ErrorText text={errors.password}
                                           style={{
                                               position: "absolute",
                                               bottom: "-22px",
                                               fontSize: "13px",
                                               color: isNotBlank(errors.password) ? "var(--red-600)" : "transparent"
                                           }}/>
                            </Grid>
                            <Grid item xs={12} mt={2}>
                                <Button onClick={() => onSubmit()} variant={"contained"} size={"large"}
                                        disabled={isBlank(data.password) || isBlank(data.email)}
                                        fullWidth>ĐĂNG NHẬP</Button>
                            </Grid>
                        </Grid>
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

export default AdminLoginPage;