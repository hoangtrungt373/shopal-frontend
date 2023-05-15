import * as React from "react";
import {useState} from "react";
import {Box} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {useForm} from "react-hook-form";
import {EnterpriseRegisterRequest} from "../../../model/enterprise/EnterpriseRegisterRequest";
import Button from "@mui/material/Button";
import {handleReceiveEnterpriseCooperationRequest} from "../../../service/enterprise.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {Link} from "react-router-dom";
import {EnterpriseRouter} from "../../../config/router";

interface Props {
}

const EnterpriseAccountingPage: React.FC<Props> = () => {

    const [isShow, setIsShow] = useState<boolean>(true);

    const {
        register,
        setValue,
        handleSubmit,
        formState: {errors}
    } = useForm<EnterpriseRegisterRequest>();

    const onSubmit = handleSubmit(data => {
        let request: EnterpriseRegisterRequest = {
            fullName: data.fullName,
            position: data.position,
            workEmail: data.workEmail,
            phoneNumber: data.phoneNumber,
            enterpriseAddress: data.enterpriseAddress,
            enterpriseName: data.enterpriseName,
            enterpriseWebsite: data.enterpriseWebsite
        }
        handleReceiveEnterpriseCooperationRequest(request)
            .then((res: string) => {
                console.log(res);
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
    });

    if (isShow) {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 2, p: 2, backgroundColor: "#fff"}}>
                <form onSubmit={onSubmit} style={{width: "50%", margin: "auto"}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography gutterBottom>Full Name</Typography>
                            <TextField {...register("fullName", {required: true})} fullWidth size={"small"}
                                       placeholder={"Mai Nguyen"}
                                       error={!!errors.fullName}/>
                            {errors.fullName &&
                                <span style={{color: "#EE4D2D"}}>Please let us know your name</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom>Title</Typography>
                            <TextField {...register("position", {required: true})} fullWidth size={"small"}
                                       placeholder={"HR Manager"}
                                       error={!!errors.position}/>
                            {errors.position &&
                                <span style={{color: "#EE4D2D"}}>Please let us know your title</span>}
                        </Grid>
                        <Grid item xs={7}>
                            <Typography gutterBottom>Work Email</Typography>
                            <TextField {...register("workEmail", {required: true})} fullWidth size={"small"}
                                       type={"email"}
                                       placeholder={"mainguyen@itviec.com"}
                                       error={!!errors.workEmail}/>
                            {errors.workEmail &&
                                <span style={{color: "#EE4D2D"}}>Please provide your work email address</span>}
                        </Grid>
                        <Grid item xs={5}>
                            <Typography gutterBottom>Phone Number</Typography>
                            <TextField {...register("phoneNumber", {required: true})} fullWidth size={"small"}
                                       placeholder={"0359569985"}
                                       error={!!errors.phoneNumber}/>
                            {errors.phoneNumber &&
                                <span style={{color: "#EE4D2D"}}>Please provide your phone number</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom>Company Location</Typography>
                            <TextField {...register("enterpriseAddress", {required: true})} fullWidth size={"small"}
                                       placeholder={"160 Bùi Thị Xuân, Phường Phạm Ngũ Lão, Quận 1, Tp.Hồ Chí Minh"}
                                       error={!!errors.enterpriseAddress}/>
                            {errors.enterpriseAddress &&
                                <span style={{color: "#EE4D2D"}}>Please provide your company address</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom>Company Name</Typography>
                            <TextField {...register("enterpriseName", {required: true})} fullWidth size={"small"}
                                       placeholder={"PHUCLONG"}
                                       error={!!errors.enterpriseName}/>
                            {errors.enterpriseName &&
                                <span style={{color: "#EE4D2D"}}>Please let us know your company name</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography gutterBottom>Website URL</Typography>
                            <TextField {...register("enterpriseWebsite", {required: true})} fullWidth size={"small"}
                                       placeholder={"https://www.circlek.com.vn/vi/"}
                                       error={!!errors.enterpriseWebsite}/>
                            {errors.enterpriseWebsite &&
                                <span style={{color: "#EE4D2D"}}>Please include a link</span>}
                        </Grid>
                        <Grid item xs={12} sx={{display: "flex", gap: 2, alignItems: "center"}}>
                            <Button type={"submit"} variant={"contained"}>Contact Me</Button>
                            <Typography>Already have an Enterprise account? <Link
                                to={EnterpriseRouter.loginPage} style={{color: "#EE4D2D"}}>Login</Link></Typography>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default EnterpriseAccountingPage;