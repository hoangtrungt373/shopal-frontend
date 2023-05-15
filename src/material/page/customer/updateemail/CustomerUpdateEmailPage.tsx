import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Customer} from "../../../model/Customer";
import {useForm} from "react-hook-form";
import PageSpinner from "../../common/share/PageSpinner";
import AlertDialog from "../../common/share/AlertDialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface Props {
    customer: Customer
}

const CustomerUpdateEmailPage: React.FC<Props> = ({customer}) => {

    const [isShow, setIsShow] = useState<boolean>(false);
    const [serverVerifyOtp, setServerVerifyOtp] = useState<string>();
    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm<Customer>();
    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "Email address updated"
    });

    /*TODO: handle change email*/
    const onSubmit = handleSubmit(data => {

    });

    useEffect(() => {
        console.log(customer)
        setValue("contactEmail", customer.contactEmail);
        setIsShow(true)
    }, [customer])


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
                <Typography variant={"h6"} mb={2}>Update email address</Typography>
                <Box sx={{width: "100%", backgroundColor: "#fff", borderRadius: 2, p: 4}}>
                    <form onSubmit={onSubmit}
                          style={{
                              borderRadius: "8px",
                              padding: "16px",
                              margin: "auto",
                              width: "50%",
                              border: "1px solid var(--neutralgray-500)",
                          }}>
                        <Typography gutterBottom>Email address</Typography>
                        <Box sx={{display: "flex", alignItems: "flex-start"}}>
                            <TextField {...register("contactEmail", {required: true})} style={{width: "70%"}}
                                       size={"small"}
                                       type={"email"}
                                       placeholder={"Input your personal email address"}
                                       helperText={"Verification code (OTP) will be sent to this email address to verify email address is yours"}
                                       error={!!errors.contactEmail}/>
                            <Button type={"button"} variant={"outlined"} sx={{width: "30%", textTransform: "initial"}}>Send
                                OTP</Button>
                        </Box>
                        <Button type={"submit"} variant={"contained"} style={{marginTop: "32px"}} fullWidth disabled>Save
                            change</Button>
                    </form>
                </Box>
            </Box>
        );
    } else {
        return (
            <PageSpinner/>
        );
    }
}

export default CustomerUpdateEmailPage;