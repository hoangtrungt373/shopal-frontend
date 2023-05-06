import * as React from "react";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import {EnterpriseRouter} from "../../../config/router";
import GavelIcon from '@mui/icons-material/Gavel';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';

interface Props {
}


export const EnterpriseMainListItems: React.FC<Props> = ({}) => (
    <React.Fragment>
        <ListItemButton>
            <ListItemIcon>
                <DashboardIcon/>
            </ListItemIcon>
            <ListItemText primary="Dashboard"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <StoreIcon/>
            </ListItemIcon>
            <ListItemText primary="Account"/>
        </ListItemButton>
        <ListItemButton href={EnterpriseRouter.productCollectionPage}>
            <ListItemIcon>
                <PlaylistAddCheckCircleIcon/>
            </ListItemIcon>
            <ListItemText primary="Product"/>
        </ListItemButton>
        <ListItemButton href={EnterpriseRouter.purchaseOrderManagement}>
            <ListItemIcon>
                <ShoppingCartIcon/>
            </ListItemIcon>
            <ListItemText primary="Orders"/>
        </ListItemButton>
        <ListItemButton href={EnterpriseRouter.customerManagementPage}>
            <ListItemIcon>
                <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Customers"/>
        </ListItemButton>
        <ListItemButton href={EnterpriseRouter.cooperationContractManagement}>
            <ListItemIcon>
                <GavelIcon/>
            </ListItemIcon>
            <ListItemText primary="Contract"/>
        </ListItemButton>
        <ListItemButton href={EnterpriseRouter.accounting}>
            <ListItemIcon>
                <BarChartIcon/>
            </ListItemIcon>
            <ListItemText primary="Accounting"/>
        </ListItemButton>
    </React.Fragment>
);