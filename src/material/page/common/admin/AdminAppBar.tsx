import * as React from "react";
import {AppBar} from "../share/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {Link, useHistory} from "react-router-dom";
import {AdminRouter, AssetPath, EnterpriseRouter} from "../../../config/router";
import {Box, ListItemButton, ListItemText} from "@mui/material";
import Divider from "@mui/material/Divider";
import {logout} from "../../../service/auth.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Typography from "@mui/material/Typography";
import './AdminAppBar.scss'
import {UserRole} from "../../../model/enums/UserRole";

interface Props {
    open?: boolean,
    toggleDrawer?: any,
    userRole?: UserRole
}

const AccountBlock: React.FC<Props> = ({userRole}) => {

    const history = useHistory();

    const handleLogout = () => {
        logout()
            .then(() => {
                window.location.pathname = userRole == UserRole.ADMIN ? AdminRouter.loginPage : EnterpriseRouter.loginPage
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    return (
        <Box className={"admin-account-block"}>
            <Box className={"dropdown"}>
                <Box sx={{display: "flex", alignItems: "center", gap: 1, p: 1.5}}>
                    <AccountCircleOutlinedIcon sx={{fontSize: "24px"}}/>
                    <Typography fontSize={"16px"}>Account</Typography>
                </Box>
                <Box className={"dropdown-content"}>
                    <ListItemButton onClick={() => handleLogout()}>
                        <ListItemText primary="Log out"/>
                    </ListItemButton>
                </Box>
            </Box>
        </Box>
    );
}


const AdminAppBar: React.FC<Props> = ({open, toggleDrawer, userRole}) => {

    return (
        <AppBar open={open}>
            <Toolbar
                sx={{
                    pr: '24px'
                }}
            >
                <Box sx={{width: "225.5px"}}>
                    <Link
                        to={userRole == UserRole.ADMIN ? AdminRouter.dashboardPage : EnterpriseRouter.dashboardPage}><img
                        src={AssetPath.webLogoUrl} alt={"img"}
                        width={"70px"} style={{marginLeft: "5px"}}/></Link>
                </Box>
                <Divider orientation="vertical" flexItem/>
                <AccountBlock userRole={userRole}/>
            </Toolbar>
        </AppBar>

    )
}

export default AdminAppBar;