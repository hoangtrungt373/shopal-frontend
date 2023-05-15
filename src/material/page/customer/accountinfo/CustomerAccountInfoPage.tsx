import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Grid, MenuItem, Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import {Customer} from "../../../model/Customer";
import {useForm} from "react-hook-form";
import {AssetPath, CustomerRouter} from "../../../config/router";
import IconButton from "@mui/material/IconButton";
import ImageSearchOutlinedIcon from "@mui/icons-material/ImageSearchOutlined";
import TextField from "@mui/material/TextField";
import {Gender} from "../../../model/enums/Gender";
import Button from "@mui/material/Button";
import {updateCurrentCustomerInfo} from "../../../service/customer.service";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import PageSpinner from "../../common/share/PageSpinner";
import AlertDialog from "../../common/share/AlertDialog";

interface Props {
    customer: Customer
}

interface GenderOption {
    label: string,
    value: Gender
}

const CustomerAccountInfoPage: React.FC<Props> = ({customer}) => {

    const [isShow, setIsShow] = useState<boolean>(false);
    const [avatarUrl, setAvatarUrl] = useState<any>();
    const [uploadAvatar, setUploadAvatar] = useState<any>();
    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm<Customer>();
    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "Profile updated"
    });

    /*TODO: handle update*/
    const onSubmit = handleSubmit(data => {
        let newCustomerInfo: Customer = {
            fullName: data.fullName,
            nickName: data.nickName,
            gender: data.gender,
            address: data.address,
            phoneNumber: data.phoneNumber,
            birthDate: data.birthDate,
            uploadAvatarUrl: uploadAvatar
        }
        updateCurrentCustomerInfo(newCustomerInfo)
            .then((res: string) => {
                setShowAlert(prevState1 => ({
                    ...prevState1,
                    open: true,
                }));
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
    });

    useEffect(() => {
        setValue("fullName", customer.fullName);
        setValue("nickName", customer.nickName);
        setValue("gender", customer.gender);
        setValue("birthDate", customer.birthDate);
        setValue("address", customer.address);
        setValue("phoneNumber", customer.phoneNumber);
        setValue("contactEmail", customer.contactEmail);
        setAvatarUrl(customer.avatarUrl);
        setIsShow(true)
        // getCurrentCustomerInfo()
        //     .then((resCustomer) => {
        //         setValue("fullName", resCustomer.fullName);
        //         setValue("nickName", resCustomer.nickName);
        //         setValue("gender", resCustomer.gender);
        //         setValue("birthDate", resCustomer.birthDate);
        //         setValue("address", resCustomer.address);
        //         setValue("phoneNumber", resCustomer.phoneNumber);
        //         setValue("contactEmail", resCustomer.contactEmail);
        //         setAvatarUrl(resCustomer.avatarUrl);
        //     }).catch((err: ExceptionResponse) => {
        //     console.log(err);
        // }).finally(() => {
        //     setIsShow(true);
        // })
    }, [customer])

    /*TODO: fetch from be*/
    const genderList: GenderOption[] = [
        {
            label: "Male",
            value: Gender.MALE
        },
        {
            label: "Female",
            value: Gender.FEMALE
        },
        {
            label: "Other",
            value: Gender.OTHER
        }
    ];

    const handleUploadAvatar = (e) => {
        setUploadAvatar(e.target.files[0]);
    }

    const DisplayAlert = () => {
        if (showAlert.open) {
            return (
                <AlertDialog
                    isOpen={showAlert.open} title={showAlert.title}/>
            )
        } else {
            return null;
        }
    }

    if (isShow) {
        return (
            <Box>
                <DisplayAlert/>
                <Typography variant={"h6"} mb={2}>Account info</Typography>
                <form onSubmit={onSubmit}
                      style={{backgroundColor: "#fff", borderRadius: "8px", padding: "16px", width: "100%"}}>
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem/>}
                        spacing={3}>
                        <Box sx={{width: "60%", display: "flex", flexDirection: "column", gap: 2}}>
                            <Typography fontSize={"16px"}>Personal information</Typography>
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
                                                avatarUrl !== null ? AssetPath.customerAvatarUrl + avatarUrl :
                                                    AssetPath.avatarPreviewImg}
                                            alt={"img"}
                                            style={{
                                                borderRadius: avatarUrl !== undefined ? "50%" : null,
                                                width: "100%",
                                                margin: "auto",
                                                display: "block"
                                            }}/>
                                        <IconButton color="primary" style={{position: "absolute", right: -12, top: -12}}
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
                                        <Typography sx={{width: "175px"}}>Full Name</Typography>
                                        <TextField {...register("fullName")} size={"small"} fullWidth
                                                   placeholder={"Add you full name here"}/>
                                    </Box>
                                    <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                        <Typography sx={{width: "175px"}}>Nickname</Typography>
                                        <TextField {...register("nickName")} size={"small"} fullWidth
                                                   placeholder={"You hava any nickname?"}/>
                                    </Box>

                                </Grid>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>Gender</Typography>
                                    <TextField
                                        select
                                        defaultValue={Gender.MALE}
                                        {...register("gender")} size={"small"}
                                        sx={{width: "100%"}}
                                    >
                                        {genderList.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography gutterBottom>Birth Date</Typography>
                                    <TextField {...register("birthDate")} size={"small"} fullWidth
                                               type={"date"}/>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography gutterBottom>Address</Typography>
                                    <TextField {...register("address")} size={"small"} fullWidth/>
                                </Grid>
                                <Grid item xs={4} mt={4}>
                                    <Button type={"submit"} variant={"contained"}>Save
                                        change</Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{width: "40%", display: "flex", flexDirection: "column", gap: 2}}>
                            <Typography fontSize={"16px"}>Email and Phone</Typography>
                            <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                                <PhoneOutlinedIcon style={{fontSize: "20px"}}/>
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Typography>Phone number</Typography>
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
                                    <Typography>Email address</Typography>
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
        );
    } else {
        return (
            <PageSpinner/>
        );
    }
}

export default CustomerAccountInfoPage;