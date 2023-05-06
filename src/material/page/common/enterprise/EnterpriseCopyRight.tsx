import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import {EnterpriseRouter} from "../../../config/router";
import * as React from "react";

interface Props {
}

export default function EnterpriseCopyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" to={EnterpriseRouter.dashboardPage}>
                Tike
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}