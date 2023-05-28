import * as React from "react";
import Box from "@mui/material/Box";
import {AssetPath} from "../../../config/router";
import Typography from "@mui/material/Typography";
import {isAuthenticated} from "../../../util/auth.util";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";

interface Props {
}

export const CartEmpty: React.FC<Props> = ({}) => {

    return (
        <Box sx={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 2,
            height: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            padding: "24px"
        }}>
            <img src={AssetPath.cartEmptyImg} alt={"cart-empty"} width={"300px"}/>
            <Typography>{isAuthenticated() ? "Bạn không có sản phẩm nào trong giỏ hàng" : "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng"}</Typography>
            <Link to={"/"}><Button variant="contained" color={"secondary"}>Continue
                shopping</Button></Link>
        </Box>
    )
}