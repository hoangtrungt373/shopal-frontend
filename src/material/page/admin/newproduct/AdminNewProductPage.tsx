import * as React from "react";
import {Box} from "@mui/material";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {EnterprisePurchaseOrder} from "../../../model/enterprise/EnterprisePurchaseOrder";
import {Enterprise} from "../../../model/Enterprise";
import {
    getPurchaseOrderDetailForCurrentEnterprise,
    updatePurchaseOrderStatusForCurrentEnterprise
} from "../../../service/order.service";
import {getCurrentEnterpriseInfo} from "../../../service/enterprise.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {OrderStatus} from "../../../model/enums/OrderStatus";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import PageSpinner from "../../common/share/PageSpinner";


interface Props {
}


const AdminNewProductPage: React.FC<Props> = ({}) => {

    const [isShow, setIsShow] = useState<boolean>(false);

    useEffect(() => {
        setIsShow(true);
    }, []);

    if (isShow) {
        return (
            <Box sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                <Typography variant={"h6"} fontWeight={"bold"}>New Product</Typography>
            </Box>
        )
    } else {
        return <PageSpinner/>
    }
}

export default AdminNewProductPage;