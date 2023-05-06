import * as React from "react";
import {AssetPath, CustomerRouter} from "../../../config/router";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";
import {Link, useHistory} from "react-router-dom";

interface Props {
}

export const CustomerCheckoutSuccessPage: React.FC<Props> = () => {

    const history = useHistory();

    // useEffect(() => {
    //     if (localStorage.getItem(PAYMENT_PROCESS) == PaymentProcess.PAYMENT_SUCCESS) {
    //         localStorage.setItem(PAYMENT_PROCESS, PaymentProcess.NO_PAYMENT_EXISTS);
    //     } else {
    //         history.push(CustomerRouter.homePage);
    //     }
    // }, [])

    return (
        <Box sx={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 2,
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2
        }}>
            <img src={AssetPath.cartEmptyImg} alt={"cart-empty"} width={"200px"}/>
            <Typography>Checkout successfully, <Link to={CustomerRouter.purchasedOrderHistory}
                                                     style={{fontSize: "16px !important"}}>click
                here to return to
                your purchase</Link></Typography>
        </Box>
    );
}