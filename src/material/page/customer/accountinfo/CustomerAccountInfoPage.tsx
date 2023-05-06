import * as React from "react";
import {createTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const theme = createTheme({
    typography: {
        body1: {
            fontSize: 14
        },
        button: {
            fontSize: 14
        },
    },
});

interface Props {
}

const CustomerAccountInfoPage: React.FC<Props> = () => {

    if (true) {
        return (
            <Box>
                <Typography variant={"h6"} mb={2}>Account info</Typography>
                <Box sx={{backgroundColor: "#fff", borderRadius: 2, p: 2}}>
                    <Typography fontSize={"16px"}>Personal information</Typography>
                </Box>
            </Box>
        );
    } else {
        return (
            <h1>Still loading</h1>
        );
    }
}

export default CustomerAccountInfoPage;