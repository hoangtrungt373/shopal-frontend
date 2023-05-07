import * as React from "react";
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import {AdminRouter} from "../../../config/router";
import GavelIcon from '@mui/icons-material/Gavel';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import CategoryIcon from '@mui/icons-material/Category';

interface Props {
}


export const AdminMainListItem: React.FC<Props> = ({}) => (
    <React.Fragment>
        <ListItemButton href={AdminRouter.dashboardPage}>
            <ListItemIcon>
                <DashboardIcon/>
            </ListItemIcon>
            <ListItemText primary="Dashboard"/>
        </ListItemButton>
        <ListItemButton href={AdminRouter.catalogManagementPage}>
            <ListItemIcon>
                <CategoryIcon/>
            </ListItemIcon>
            <ListItemText primary="Catalog"/>
        </ListItemButton>
        <ListItemButton href={AdminRouter.productCollectionPage}>
            <ListItemIcon>
                <PlaylistAddCheckCircleIcon/>
            </ListItemIcon>
            <ListItemText primary="Product"/>
        </ListItemButton>
        <ListItemButton href={AdminRouter.purchaseOrderManagement}>
            <ListItemIcon>
                <ShoppingCartIcon/>
            </ListItemIcon>
            <ListItemText primary="Orders"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Customers"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <GavelIcon/>
            </ListItemIcon>
            <ListItemText primary="Contract"/>
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <BarChartIcon/>
            </ListItemIcon>
            <ListItemText primary="Accounting"/>
        </ListItemButton>
    </React.Fragment>
);