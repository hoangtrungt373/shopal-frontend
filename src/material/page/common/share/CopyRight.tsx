import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import * as React from "react";
import {Box} from "@mui/material";

interface Props {
    url: string
}

export const CopyRight: React.FC<Props> = ({url}) => {
    return (
        <Box sx={{
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #F3F3F3",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
            color: "#8a909d"
        }}>
            <Typography variant="body2" color="text.secondary" align="center">
                {'Copyright © '}
                <Link color="inherit" to={url}>
                    Shopal
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
    )
}