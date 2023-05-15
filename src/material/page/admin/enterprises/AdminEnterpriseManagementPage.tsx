import * as React from "react";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";


interface Props {
}


const AdminEnterpriseManagementPage: React.FC<Props> = ({}) => {

    const [isShow, setIsShow] = useState<boolean>(false);

    useEffect(() => {
        setIsShow(true);
    }, []);

    if (isShow) {
        return (
            <Box sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                <Typography variant={"h6"} fontWeight={"bold"}>Enterprises</Typography>
            </Box>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminEnterpriseManagementPage;