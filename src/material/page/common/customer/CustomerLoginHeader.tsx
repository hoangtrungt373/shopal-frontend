import * as React from "react";
import {AssetPath, CustomerRouter} from "../../../config/router";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";
import './CustomerHomeHeader.scss'
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";

interface Props {
    title: string
}

export const CustomerLoginHeader: React.FC<Props> = ({title}) => {

    return (
        <Stack sx={{backgroundColor: "#fff", p: "16px 194px", mb: 1}} spacing={2}>
            <Stack direction={"row"} spacing={3} alignItems={"center"}>
                <Box>
                    <Link to={CustomerRouter.homePage}><img src={AssetPath.webLogoUrl} alt={"img"}
                                                            width={"140px"}/></Link>
                </Box>
                <Typography fontSize={"24px"} fontWeight={500} align={"left"}>{title}</Typography>
                <Link to={"#"} style={{
                    marginLeft: "auto",
                    color: "var(--bluebreak-600)"
                }}>Bạn cần giúp đỡ?</Link>
            </Stack>
        </Stack>
    )
        ;
}