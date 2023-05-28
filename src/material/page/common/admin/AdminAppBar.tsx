import * as React from "react";
import {AppBar} from "../share/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {Link, useHistory} from "react-router-dom";
import {AdminRouter, AssetPath, EnterpriseRouter} from "../../../config/router";
import {Box} from "@mui/material";
import Divider from "@mui/material/Divider";
import {logout} from "../../../service/auth.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import Typography from "@mui/material/Typography";
import './AdminAppBar.scss'
import {UserRole} from "../../../model/enums/UserRole";
import {removeExtensionEmail} from "../../../util/display.util";
import {Enterprise} from "../../../model/Enterprise";

interface Props {
    open?: boolean,
    toggleDrawer?: any,
    userRole?: UserRole,
    currentEnterprise?: Enterprise
}

const AccountBlock: React.FC<Props> = ({userRole, currentEnterprise}) => {

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
        <Box className={"admin-account-block"}
             sx={{display: "flex", alignItems: "center", gap: 2, marginLeft: "auto", marginRight: "36px"}}>
            <Box className={"dropdown"}>
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <img alt="img" onError={(e) => {
                        // @ts-ignore
                        e.target.src = AssetPath.avatarDefaultImg
                    }}
                         src={userRole == UserRole.ENTERPRISE_MANAGER ? `${AssetPath.enterpriseLogoUrl}${currentEnterprise.logoUrl}` : AssetPath.avatarDefaultImg}
                         style={{width: 40, height: 40, display: "block", borderRadius: "50%"}}/>
                    {
                        userRole == UserRole.ENTERPRISE_MANAGER ? (
                            <Typography>{removeExtensionEmail(currentEnterprise.contactEmail)}</Typography>
                        ) : (
                            <Typography>Admin</Typography>
                        )
                    }
                </Box>
                <Box className={"dropdown-content"}>
                    <Link to={EnterpriseRouter.profilePage}>Profile</Link>
                    <Link to={EnterpriseRouter.notificationPage}>Notification</Link>
                    <Typography onClick={() => handleLogout()}>Log out</Typography>
                </Box>
            </Box>
        </Box>
    );
}


const AdminAppBar: React.FC<Props> = ({open, toggleDrawer, userRole, currentEnterprise}) => {

    return (
        <AppBar open={open}>
            <Toolbar
                sx={{
                    pr: '24px',
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <Box sx={{width: "225.5px"}}>
                    <Link
                        to={userRole == UserRole.ADMIN ? AdminRouter.dashboardPage : EnterpriseRouter.dashboardPage}><img
                        src={AssetPath.webLogoUrl} alt={"img"}
                        width={"130px"} style={{display: "block"}}/></Link>
                </Box>
                <Divider orientation="vertical" flexItem/>
                <AccountBlock userRole={userRole} currentEnterprise={currentEnterprise}/>
            </Toolbar>
        </AppBar>

    )
}

export default AdminAppBar;