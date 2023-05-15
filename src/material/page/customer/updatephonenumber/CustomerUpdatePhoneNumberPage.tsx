import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Customer} from "../../../model/Customer";
import {useForm} from "react-hook-form";
import {updateCurrentCustomerInfo} from "../../../service/customer.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import PageSpinner from "../../common/share/PageSpinner";
import AlertDialog from "../../common/share/AlertDialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import './CustomerUpdatePhoneNumberPage.scss'

interface Props {
    customer: Customer
}

const CustomerUpdatePhoneNumberPage: React.FC<Props> = ({customer}) => {

    const [isShow, setIsShow] = useState<boolean>(false);
    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState: {errors}
    } = useForm<Customer>();
    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "Phone number updated"
    });

    const onSubmit = handleSubmit(data => {
        let newCustomerInfo: Customer = customer;
        newCustomerInfo.phoneNumber = data.phoneNumber;
        updateCurrentCustomerInfo(newCustomerInfo)
            .then((res: string) => {
                console.log(res);
                setShowAlert(prevState1 => ({
                    ...prevState1,
                    open: true,
                }));
            }).catch((err: ExceptionResponse) => {
            console.log(err);
        })
    });

    useEffect(() => {
        setValue("phoneNumber", customer.phoneNumber);
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
                <Typography variant={"h6"} mb={2}>Update phone number</Typography>
                <Box sx={{width: "100%", backgroundColor: "#fff", borderRadius: 2, p: 4}}>
                    <form onSubmit={onSubmit}
                          style={{
                              borderRadius: "8px",
                              padding: "16px",
                              margin: "auto",
                              width: "50%",
                              border: "1px solid var(--neutralgray-500)",
                          }}>
                        <Typography gutterBottom>Phone number</Typography>
                        <TextField {...register("phoneNumber", {required: true})} fullWidth size={"small"}
                                   type={"number"}
                                   placeholder={"Input your personal phone number"}
                                   helperText={"Verification code (OTP) will be sent to this phone number to verify phone number is yours"}
                                   error={!!errors.phoneNumber}/>
                        <Button type={"submit"} variant={"contained"} style={{marginTop: "32px"}} fullWidth>Save
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

export default CustomerUpdatePhoneNumberPage;