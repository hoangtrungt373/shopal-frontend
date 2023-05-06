import React from 'react';
import {CircularProgress, Stack} from "@mui/material";

interface Props {
}

const PageSpinner: React.FC<Props> = () => {
    /*change to skeleton later*/
    return (
        <Stack alignItems={"center"}>
            <CircularProgress/>
        </Stack>
    );
};

export default PageSpinner;
