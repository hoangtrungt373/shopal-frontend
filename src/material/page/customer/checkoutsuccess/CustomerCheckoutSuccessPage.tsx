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
            height: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2
        }}>
            <img src={AssetPath.orderSuccessImg} alt={"cart-empty"} width={"300px"}/>
            <Typography>Bạn đã đặt hàng thành công. <Link to={CustomerRouter.purchasedOrderHistory}
                                                          style={{fontSize: "16px", color: "var(--bluebreak-600)"}}>Nhấp
                vào đây để vào
                trang quản lý đơn hàng</Link></Typography>
        </Box>
    );
}