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
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2
        }}>
            <img src={AssetPath.cartEmptyImg} alt={"cart-empty"} width={"200px"}/>
            <Typography>{isAuthenticated() ? "There is no item in your cart" : "Please login to add item in your cart"}</Typography>
            <Link to={"/"}><Button variant="contained" size={"small"} color={"secondary"}>Continue
                shopping</Button></Link>
        </Box>
    )
}