import * as React from "react";
import {Drawer} from "../share/Drawer";
import List from "@mui/material/List";
import './AdminDrawer.scss'

interface Props {
    open: boolean,
    toggleDrawer: any,
    content: any
}


const AdminDrawer: React.FC<Props> = ({open, toggleDrawer, content}) => {

    return (
        <Drawer variant="permanent" open={open} className={"drawer"}>
            <List component="nav">
                {content}
            </List>
        </Drawer>
    )
}

export default AdminDrawer;