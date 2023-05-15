import * as React from "react";
import {Tooltip} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import {AssetPath} from "../../../config/router";

interface Props {
    title: string,
    logoUrl: string,
    height: number,
    width: number
}

export const EnterpriseLogo: React.FC<Props> = ({title, logoUrl, height, width}) => {
    return (
        <Tooltip title={title}>
            <Avatar alt="img"
                    src={AssetPath.enterpriseLogoUrl + logoUrl}
                    sx={{width: width, height: height}}/>
        </Tooltip>
    )
}