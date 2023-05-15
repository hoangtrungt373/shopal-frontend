import * as React from "react";
import Box from "@mui/material/Box";

interface Props {
    text: string
    style?: any
}

export const ErrorText: React.FC<Props> = ({text, style}) => {
    return (
        <Box style={{color: "var(--red-600)"}}>
            <span style={style}>{text}</span>
        </Box>
    )
}