import * as React from "react";
import {Divider} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import {Drawer} from "../share/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";

interface Props {
    open: boolean,
    toggleDrawer: any,
    content: any
}


const AdminDrawer: React.FC<Props> = ({open, toggleDrawer, content}) => {

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

export default AdminDrawer;