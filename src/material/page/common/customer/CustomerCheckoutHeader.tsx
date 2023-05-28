import * as React from "react";
import {AssetPath, CustomerRouter} from "../../../config/router";
import Typography from "@mui/material/Typography";
import {Stack} from "@mui/material";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import {Link} from "react-router-dom";

interface Props {
}

export const CustomerCheckoutHeader: React.FC<Props> = () => {

    return (
        <Stack direction="row"
               alignItems={"center"}
               divider={<Divider orientation="vertical" flexItem className={"divider"}/>}
               sx={{
                   padding: "24px 180px",
                   marginBottom: 2,
                   backgroundColor: "#fff",
                   gap: 2
               }}>
            <Box>
                <Link to={CustomerRouter.homePage}><img src={AssetPath.webLogoUrl} alt={"img"} width={"140px"}/></Link>
            </Box>
            <Typography component="h2" variant="h5" color={"#1BA8FF"}>Check out</Typography>
        </Stack>
    );
}