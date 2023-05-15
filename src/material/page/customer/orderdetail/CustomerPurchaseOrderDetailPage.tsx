import * as React from "react";
import {useEffect, useState} from "react";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import PageSpinner from "../../common/share/PageSpinner";
import {useParams} from "react-router-dom";
import {getAllPurchaseOrderForCurrentCustomer} from "../../../service/order.service";
import {CustomerPurchaseOrder} from "../../../model/customer/CustomerPurchaseOrder";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";


interface Props {
}

interface RouteParams {
    purchaseOrderId: any;
}

const CustomerPurchaseOrderDetailPage: React.FC<Props> = ({}) => {

    const [isShow, setIsShow] = useState<boolean>(false);
    const [purchaseOrder, setPurchaseOrder] = useState<CustomerPurchaseOrder>();
    const params: RouteParams = useParams()

    useEffect(() => {
        getAllPurchaseOrderForCurrentCustomer()
            .then((resCustomerPurchaseOrders: CustomerPurchaseOrder[]) => {
                let resPurchaseOrder: CustomerPurchaseOrder = resCustomerPurchaseOrders.find(x => x.id == params.purchaseOrderId);
                if (resPurchaseOrder !== undefined) {
                    setPurchaseOrder(resPurchaseOrder)
                } else {
                    /*TODO: not found here*/
                }
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }, []);

    if (isShow) {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Typography variant={"h6"}>My Purchase</Typography>
            </Box>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }
}

export default CustomerPurchaseOrderDetailPage;