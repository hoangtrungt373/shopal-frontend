import * as React from "react";
import {AssetPath} from "../../../config/router";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";

interface Props {
}

export const CustomerCheckoutHeader: React.FC<Props> = () => {

    return (
        <Box sx={{
            padding: "24px 180px",
            marginBottom: 2,
            backgroundColor: "#fff",
            display: "flex",
            alignItem: "center",
            gap: 2
        }}>
            <img src={AssetPath.webLogoUrl} alt={"img"} width={"50px"}/>
            <div className={"divider"}></div>
            <Typography component="h2" variant="h5" color={"#1BA8FF"} sx={{mt: 1}}>Check out</Typography>
        </Box>
    );
}