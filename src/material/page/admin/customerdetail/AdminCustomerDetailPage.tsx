import * as React from "react";
import {useEffect, useState} from "react";
import {Box, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import {CustomerAllInfo} from "../../../model/admin/CustomerAllInfo";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {useParams} from "react-router-dom";
import {CustomerSearchCriteriaRequest} from "../../../model/request/CustomerSearchCriteriaRequest";
import {getCustomerAllInfoByCriteria} from "../../../service/customer.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {AdminRouter, AssetPath} from "../../../config/router";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";


interface Props {
    customerAllInfo: CustomerAllInfo
}

interface RouteParams {
    customerId: any;
}

const AdminCustomerDetailPage: React.FC<Props> = ({}) => {

    const params: RouteParams = useParams();
    const [customerAllInfo, setCustomerAllInfo] = useState<CustomerAllInfo>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [breadCrumbItems, setBreadCrumbItems] = useState<BreadcrumbItem[]>([]);

    useEffect(() => {
        let criteria: CustomerSearchCriteriaRequest = {
            customerId: params.customerId
        }
        getCustomerAllInfoByCriteria(criteria)
            .then((resCustomerAllInfos: CustomerAllInfo[]) => {
                if (resCustomerAllInfos.length == 1) {
                    setCustomerAllInfo(resCustomerAllInfos[0]);
                    setBreadCrumbItems([
                        {
                            url: AdminRouter.customerManagementPage,
                            title: "Customer",
                        },
                        {
                            title: resCustomerAllInfos[0].contactEmail,
                            isLasted: true
                        },
                    ]);
                } else {
                    /*TDDO: handle not found*/
                    console.log("Customer not found");
                }
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            }).finally(() => {
            setIsShow(true);
        })
    }, [params.customerId]);

    /*TODO: show customer order history, customer's review*/
    if (isShow) {
        return (
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Customer Detail"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <Typography className={"page-sub-header"}>Customer Detail: #{customerAllInfo.id}</Typography>
                    <Divider style={{marginLeft: "-16px", marginRight: "-16px"}}/>
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem/>}
                        spacing={2}>
                        <Stack spacing={4} sx={{width: "25%",}} divider={<Divider flexItem/>}>
                            <Stack spacing={2} alignItems={"center"}>
                                <Avatar alt="img" variant={"square"}
                                        src={AssetPath.customerAvatarUrl + customerAllInfo.avatarUrl}
                                        sx={{width: 100, height: 100, borderRadius: 2}}/>
                                <Stack alignItems={"center"}>
                                    <Typography fontWeight={"bold"} color={"var(--neutralgray-800)"}
                                                fontSize={"18px"}>{customerAllInfo.fullName}</Typography>
                                    <Typography>{customerAllInfo.contactEmail}</Typography>
                                </Stack>
                            </Stack>
                            <Stack spacing={2}>
                                <Typography fontWeight={"bold"} color={"var(--neutralgray-800)"} fontSize={"18px"}>Personal
                                    Information</Typography>
                                <Stack direction={"row"}>
                                    <Stack width={"50%"}>
                                        <Typography fontWeight={"bold"}
                                                    color={"var(--neutralgray-800)"}>Gender</Typography>
                                        <Typography>{customerAllInfo.genderDescription}</Typography>
                                    </Stack>
                                    <Stack width={"50%"}>
                                        <Typography fontWeight={"bold"}
                                                    color={"var(--neutralgray-800)"}>Nickname</Typography>
                                        <Typography>{customerAllInfo.nickName}</Typography>
                                    </Stack>
                                </Stack>
                                <Stack direction={"row"}>
                                    <Stack width={"50%"}>
                                        <Typography fontWeight={"bold"}
                                                    color={"var(--neutralgray-800)"}>Birthdate</Typography>
                                        <Typography>{customerAllInfo.birthDate}</Typography>
                                    </Stack>
                                    <Stack width={"50%"}>
                                        <Typography fontWeight={"bold"} color={"var(--neutralgray-800)"}>Join
                                            date</Typography>
                                        <Typography>{customerAllInfo.joinDate}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack spacing={2}>
                                <Typography fontWeight={"bold"} color={"var(--neutralgray-800)"} fontSize={"18px"}>Contact
                                    Information</Typography>
                                <Stack>
                                    <Typography fontWeight={"bold"} color={"var(--neutralgray-800)"}>Email
                                        address</Typography>
                                    <Typography>{customerAllInfo.contactEmail}</Typography>
                                </Stack>
                                <Stack>
                                    <Typography fontWeight={"bold"} color={"var(--neutralgray-800)"}>Phone
                                        Number</Typography>
                                    <Typography>{customerAllInfo.phoneNumber}</Typography>
                                </Stack>
                                <Stack>
                                    <Typography fontWeight={"bold"}
                                                color={"var(--neutralgray-800)"}>Address</Typography>
                                    <Typography>{customerAllInfo.address}</Typography>
                                </Stack>
                                <Stack>
                                    <Typography fontWeight={"bold"} color={"var(--neutralgray-800)"}>Social
                                        Profile</Typography>
                                    <Stack direction={"row"} spacing={1}>

                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Box sx={{
                            width: "70%",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>

                        </Box>
                    </Stack>
                </Box>
            </Box>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminCustomerDetailPage;