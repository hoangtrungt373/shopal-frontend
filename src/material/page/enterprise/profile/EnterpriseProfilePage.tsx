import * as React from "react";
import {useEffect, useState} from "react";
import {Alert, Box, Grid, Stack} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import {Enterprise} from "../../../model/Enterprise";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {useForm} from "react-hook-form";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {AssetPath, CustomerRouter} from "../../../config/router";
import IconButton from "@mui/material/IconButton";
import ImageSearchOutlinedIcon from "@mui/icons-material/ImageSearchOutlined";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {ErrorText} from "../../common/share/ErrorText";
import {updateCurrentEnterpriseInfo} from "../../../service/enterprise.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";


interface Props {
    currentEnterprise?: Enterprise
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Profile",
        isLasted: true
    }
]


const EnterpriseProfilePage: React.FC<Props> = ({currentEnterprise}) => {

    const [isShow, setIsShow] = useState<boolean>(false);
    const [uploadAvatar, setUploadAvatar] = useState<any>();
    const [avatarUrl, setAvatarUrl] = useState<any>();
    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm<Enterprise>();
    const [showAlert, setShowAlert] = useState({
        open: false,
        content: null,
        severity: null
    });

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

    const onSubmit = handleSubmit(data => {
        data.uploadLogoUrl = uploadAvatar;
        updateCurrentEnterpriseInfo(data)
            .then((res: string) => {
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
            } else {
                console.log(err);
            }
        })
    });

    useEffect(() => {
        setValue("id", currentEnterprise.id);
        setValue("enterpriseName", currentEnterprise.enterpriseName);
        setValue("logoUrl", currentEnterprise.logoUrl);
        setValue("phoneNumber", currentEnterprise.phoneNumber);
        setValue("address", currentEnterprise.address);
        setValue("websiteUrl", currentEnterprise.websiteUrl);
        setValue("joinDate", currentEnterprise.joinDate);
        setValue("taxId", currentEnterprise.taxId);
        setValue("contactEmail", currentEnterprise.contactEmail);
        setAvatarUrl(currentEnterprise.logoUrl);
        setIsShow(true)
        document.title = currentEnterprise.enterpriseName + " - Profile";
    }, [currentEnterprise]);

    const handleUploadAvatar = (e) => {
        setUploadAvatar(e.target.files[0]);
    }

    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Profile"}/>
                <Stack spacing={2}>
                    <Box className={"content-box"} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                        <form onSubmit={onSubmit}
                              style={{backgroundColor: "#fff", borderRadius: "8px", padding: "16px", width: "100%"}}>
                            <Stack
                                direction="row"
                                divider={<Divider orientation="vertical" flexItem/>}
                                spacing={3}>
                                <Box sx={{width: "60%", display: "flex", flexDirection: "column", gap: 2}}>
                                    <Typography fontSize={"16px"}>Enterprise Info</Typography>
                                    <Grid container spacing={2} alignItems={"center"}>
                                        <Grid item xs={3}>
                                            <Box sx={{
                                                border: "5px solid #C2E1FF",
                                                borderRadius: "50%",
                                                backgroundColor: "#F0F8FF",
                                                padding: avatarUrl !== undefined ? 0 : 3,
                                                position: "relative"
                                            }}>
                                                <img
                                                    src={uploadAvatar !== undefined ? URL.createObjectURL(uploadAvatar) :
                                                        avatarUrl !== null ? AssetPath.enterpriseLogoUrl + avatarUrl :
                                                            AssetPath.avatarPreviewImg}
                                                    alt={"img"}
                                                    style={{
                                                        borderRadius: avatarUrl !== undefined ? "50%" : null,
                                                        width: "100%",
                                                        margin: "auto",
                                                        display: "block"
                                                    }}/>
                                                <IconButton color="primary"
                                                            style={{position: "absolute", right: -8, top: -8}}
                                                            disableRipple={true}
                                                            size={"large"} aria-label="upload picture"
                                                            component="label">
                                                    <input hidden accept="image/*" type="file"
                                                           onChange={(e) => handleUploadAvatar(e)}/>
                                                    <ImageSearchOutlinedIcon/>
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={9}
                                              sx={{display: "flex", flexDirection: "column", gap: 3}}>
                                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                                <Typography sx={{width: "180px"}}>Enterprise Name</Typography>
                                                <TextField {...register("enterpriseName")} size={"small"} fullWidth
                                                           error={!!errors.enterpriseName}/>
                                                {
                                                    errors.enterpriseName && (
                                                        <ErrorText text={"Enterprise Name is required"}/>
                                                    )
                                                }
                                            </Box>
                                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                                <Typography sx={{width: "180px"}}>Tax ID</Typography>
                                                <TextField {...register("taxId")} size={"small"} fullWidth
                                                           error={!!errors.taxId}/>
                                                {
                                                    errors.enterpriseName && (
                                                        <ErrorText text={"Enterprise Name is required"}/>
                                                    )
                                                }
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography gutterBottom>Join Date</Typography>
                                            <TextField {...register("joinDate")} disabled={true} size={"small"}
                                                       fullWidth
                                                       type={"date"}/>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography gutterBottom>Address</Typography>
                                            <TextField {...register("address")} size={"small"} fullWidth
                                                       error={!!errors.address}/>
                                            {
                                                errors.address && (
                                                    <ErrorText text={"Address is required"}/>
                                                )
                                            }
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography gutterBottom>Website Url</Typography>
                                            <TextField {...register("websiteUrl")} size={"small"} fullWidth
                                                       error={!!errors.websiteUrl}/>
                                            {
                                                errors.websiteUrl && (
                                                    <ErrorText text={"Website Url is required"}/>
                                                )
                                            }
                                        </Grid>
                                        <Grid item xs={4} mt={4}>
                                            <Button type={"submit"} variant={"contained"}>Save Change</Button>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {
                                                showAlert.open && (
                                                    <Alert severity={showAlert.severity}>{showAlert.content}</Alert>
                                                )
                                            }
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box sx={{width: "40%", display: "flex", flexDirection: "column", gap: 2}}>
                                    <Typography fontSize={"16px"}>Phone and Email</Typography>
                                    <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                                        <PhoneOutlinedIcon style={{fontSize: "20px"}}/>
                                        <Box sx={{display: "flex", flexDirection: "column"}}>
                                            <Typography>Phone</Typography>
                                            <Typography>{getValues("phoneNumber")}</Typography>
                                        </Box>
                                        <Button variant={"outlined"} href={CustomerRouter.updatePhoneNumberPage}
                                                sx={{justifySelf: "flex-end", marginLeft: "auto", height: 25}}
                                                size={"small"}>Update</Button>
                                    </Box>
                                    <Divider/>
                                    <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                                        <EmailOutlinedIcon style={{fontSize: "20px"}}/>
                                        <Box sx={{display: "flex", flexDirection: "column"}}>
                                            <Typography>Contact Email</Typography>
                                            <Typography>{getValues("contactEmail")}</Typography>
                                        </Box>
                                        <Button variant={"outlined"} href={CustomerRouter.updateEmailPage}
                                                sx={{justifySelf: "flex-end", marginLeft: "auto", height: 25}}
                                                size={"small"}>Update</Button>
                                    </Box>
                                </Box>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Stack>
        )
    } else {
        return <PageSpinner/>
    }
}

export default EnterpriseProfilePage;