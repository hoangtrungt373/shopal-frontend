import * as React from "react";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import {EnterpriseAccounting} from "../../../model/enterprise/EnterpriseAccounting";


interface Props {
    enterpriseAccounting: EnterpriseAccounting
}

const EnterpriseAccountingDetailPage: React.FC<Props> = () => {

    const [enterpriseAccounting, setEnterpriseAccounting] = useState<EnterpriseAccounting>();
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
    }, [])

    if (isShow) {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Typography variant={"h6"} fontWeight={"bold"}>Accounting Invoice
                    #{enterpriseAccounting.id}</Typography>
            </Box>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default EnterpriseAccountingDetailPage;