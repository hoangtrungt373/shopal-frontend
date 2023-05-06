import * as React from "react";
import {Badge, Divider} from "@mui/material";
import {AppBar} from "../share/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {Drawer} from "../share/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";
import {EnterpriseMainListItems} from "./EnterpriseMainListItem";

interface Props {
    open: boolean,
    toggleDrawer: any,
    content: any
}


const EnterpriseDrawer: React.FC<Props> = ({open, toggleDrawer, content}) => {

    return (
        <Drawer variant="permanent" open={open}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: 1,
                }}
            >
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon/>
                </IconButton>
            </Toolbar>
            <Divider/>
            <List component="nav">
                {content}
            </List>
        </Drawer>
    )
}

export default EnterpriseDrawer;