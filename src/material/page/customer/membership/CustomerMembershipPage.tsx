import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {EnterpriseMembership} from "../../../model/customer/EnterpriseMembership";
import {getEnterpriseMembershipForCurrentCustomer} from "../../../service/membership.service";
import Avatar from "@mui/material/Avatar";
import {AssetPath} from "../../../config/router";
import Divider from "@mui/material/Divider";
import PageSpinner from "../../common/share/PageSpinner";
import Button from "@mui/material/Button";
import SyncIcon from '@mui/icons-material/Sync';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";


interface Props {
    enterpriseMemberships?: EnterpriseMembership[]
}

const EnterpriseMembershipList: React.FC<Props> = ({enterpriseMemberships}) => {

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            {
                enterpriseMemberships.map((enterpriseMembership, index) => (
                    <Box key={"index"} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                        <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                            <Typography
                                fontSize={"30px"}>{enterpriseMembership.availablePoint}</Typography>
                            <Avatar alt="img"
                                    src={AssetPath.enterpriseLogoUrl + enterpriseMembership.enterprise.logoUrl}
                                    sx={{width: 50, height: 50}}/>
                            <Button variant="outlined" startIcon={<SyncIcon/>}>
                                Sync info now
                            </Button>

                        </Box>
                        <Divider/>
                    </Box>
                ))
            }
        </Box>
    )
}

const EnterpriseMembershipEmpty: React.FC<Props> = ({}) => {

    return (
        <Box sx={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 2,
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2
        }}>
            <img src={AssetPath.cartEmptyImg} alt={"cart-empty"} width={"200px"}/>
            <Typography>You still dont' register as membership of any enterprise</Typography>
        </Box>
    )
}

const EnterpriseMembershipRequest: React.FC<Props> = () => {

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <TextField required id="email" label="Register Email" name="email"/>
            <TextField required id="phone" label="Register Phone number" name="phone"/>
            <Button variant={"contained"}>Request new</Button>
        </Box>
    )
}

const CustomerMembershipPage: React.FC<Props> = () => {

    const [enterpriseMemberships, setEnterpriseMemberships] = useState<EnterpriseMembership[]>([])
    const [isShow, setIsShow] = useState<boolean>(false);

    useEffect(() => {
        getEnterpriseMembershipForCurrentCustomer()
            .then((resEnterpriseMemberships: EnterpriseMembership[]) => {
                setEnterpriseMemberships(resEnterpriseMemberships);
                setIsShow(true);
            })
    }, [])

    return (
        <Box>
            <Typography variant={"h6"} mb={2}>Membership info</Typography>
            <Box
                sx={{backgroundColor: "#fff", borderRadius: 2, p: 2, display: "flex", flexDirection: "column", gap: 2}}>
                <Typography fontSize={"16px"}>List enterprise you have registered as membership</Typography>
                {
                    isShow ? (
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                {
                                    enterpriseMemberships.length > 0 ? (
                                        <EnterpriseMembershipList enterpriseMemberships={enterpriseMemberships}/>
                                    ) : (
                                        <EnterpriseMembershipEmpty/>
                                    )
                                }
                            </Grid>
                            <Grid item xs={4}>
                                <EnterpriseMembershipRequest/>
                            </Grid>
                        </Grid>
                    ) : (
                        <PageSpinner/>
                    )
                }
            </Box>
        </Box>
    );
}

export default CustomerMembershipPage;