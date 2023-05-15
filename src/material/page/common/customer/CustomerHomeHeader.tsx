import * as React from "react";
import {useState} from "react";
import {AssetPath, CustomerRouter} from "../../../config/router";
import {Link, useHistory} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {isAuthenticated} from "../../../util/auth.util";
import {Customer} from "../../../model/Customer";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import './CustomerHomeHeader.scss'
import {ListItemButton, ListItemText} from "@mui/material";
import {logout} from "../../../service/auth.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {ProductSearchPath} from "../../../model/request/ProductSearchPath";
import {createSearchQuery} from "../../../util/search.utils";
import {ShoppingCartOutlined} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

interface Props {
    currentCustomer?: Customer,
}

const CustomerBlock: React.FC<Props> = ({currentCustomer}) => {

    const history = useHistory();

    const handleLogout = () => {
        logout()
            .then(() => {
                window.location.reload();
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    return (
        <Box className={"dropdown"}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1, p: 1.5}}>
                <AccountCircleOutlinedIcon sx={{fontSize: "24px"}}/>
                <Typography fontSize={"16px"}>Account</Typography>
            </Box>
            <Box className={"dropdown-content"}>
                <ListItemButton href={CustomerRouter.dashBoardPage}>
                    <ListItemText primary="My Account"/>
                </ListItemButton>
                <ListItemButton href={CustomerRouter.purchasedOrderHistory}>
                    <ListItemText primary="My Purchase"/>
                </ListItemButton>
                <ListItemButton onClick={() => handleLogout()}>
                    <ListItemText primary="Log out"/>
                </ListItemButton>
            </Box>
        </Box>
    );
}

export const CustomerHomeHeader: React.FC<Props> = ({currentCustomer}) => {

    const [keyword, setKeyword] = useState<string>();

    const history = useHistory();

    const handleChange = (e) => {
        setKeyword(e.target.value);
    }

    const searchProductByKeyword = () => {
        let productSearchPath: ProductSearchPath = {
            keyword: keyword
        }

        history.push(CustomerRouter.productCollectionPage + createSearchQuery(productSearchPath));
    }

    const handleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
            searchProductByKeyword();
        }
    }

    return (
        <Box sx={{backgroundColor: "#fff", mb: 2, p: "24px 194px"}}>
            <Grid container spacing={2} alignItems={"center"}>
                <Grid item xs={1}>
                    <Link to={CustomerRouter.homePage}><img src={AssetPath.webLogoUrl} alt={"img"}
                                                            width={"60px"}/></Link>
                </Grid>
                <Grid item xs={6}>
                    <form style={{display: "flex", width: "100%"}}>

                        <TextField fullWidth onChange={handleChange} onKeyDown={(e) => handleKeyDown(e)}
                                   placeholder={"Search products..."} size={"small"}/>
                        <Button variant={"outlined"} onClick={() => searchProductByKeyword()}>Search</Button>
                    </form>
                </Grid>
                <Grid item xs={5}>
                    {
                        !isAuthenticated() ? (
                            <Box sx={{
                                marginLeft: "auto",
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                justifyContent: "flex-end"
                            }}>
                                <Link to={CustomerRouter.registerPage}><Button
                                    variant={"contained"}>Register</Button></Link>
                                <Typography>|</Typography>
                                <Link to={CustomerRouter.loginPage}><Button
                                    variant={"outlined"}>Login</Button></Link>
                            </Box>
                        ) : (
                            <Box sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: 1
                            }}>
                                <CustomerBlock currentCustomer={currentCustomer}/>
                                <Typography>|</Typography>
                                <Link to={CustomerRouter.cartPage}>
                                    <IconButton aria-label="delete" size="small">
                                        <ShoppingCartOutlined/>
                                    </IconButton>
                                </Link>
                            </Box>
                        )
                    }
                </Grid>
            </Grid>
        </Box>
    );
}