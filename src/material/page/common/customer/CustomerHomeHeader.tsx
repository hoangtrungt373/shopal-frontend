import * as React from "react";
import {useEffect, useState} from "react";
import {AssetPath, CustomerRouter, EnterpriseRouter} from "../../../config/router";
import {Link, useHistory} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {isAuthenticated} from "../../../util/auth.util";
import {Customer} from "../../../model/Customer";
import './CustomerHomeHeader.scss'
import {InputBase, Stack} from "@mui/material";
import {logout} from "../../../service/auth.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {ProductSearchPath} from "../../../model/request/ProductSearchPath";
import {createSearchQuery} from "../../../util/search.utils";
import {ShoppingCartOutlined} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import SearchIcon from '@mui/icons-material/Search';
import {isCurrentScreenIsLoginOrRegisterPage, removeExtensionEmail} from "../../../util/display.util";

interface Props {
    currentCustomer?: Customer,
}

export const CustomerHomeHeader: React.FC<Props> = ({currentCustomer}) => {

    const [isShow, setIsShow] = useState<boolean>(false);
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

    const handleLogout = () => {
        logout()
            .then(() => {
                window.location.pathname = CustomerRouter.homePage
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            })
    }

    useEffect(() => {
        setIsShow(!isCurrentScreenIsLoginOrRegisterPage(window.location.href));
    }, [window.location.href])

    return (
        <Stack sx={{
            backgroundColor: "#fff", mb: 2, p: "8px 194px"
            // , display: isShow ? "flex" : "none"
        }} spacing={2}>
            <Stack direction={"row"} justifyContent={"space-between"}>
                <Stack direction={"row"} spacing={2} alignItems={"center"} className={"top-header"}
                       divider={<Divider orientation="vertical" flexItem/>}>
                    <Link to={EnterpriseRouter.loginPage}>Kênh doanh nghiệp</Link>
                    <Link to={EnterpriseRouter.registerPage}>Trở thành doanh nghiệp hợp tác Shopal</Link>
                </Stack>
                {
                    isAuthenticated() ? (
                        <Stack direction={"row"} spacing={1} alignItems={"center"} className={"top-header dropdown"}
                               style={{textAlign: "right"}}>
                            <img alt="img" onError={(e) => {
                                // @ts-ignore
                                e.target.src = AssetPath.avatarDefaultImg
                            }}
                                 src={`${AssetPath.customerAvatarUrl}${currentCustomer.avatarUrl}`}
                                 style={{width: 20, height: 20, display: "block", borderRadius: "50%"}}/>
                            <Typography>{removeExtensionEmail(currentCustomer.contactEmail)}</Typography>
                            <Box className={"dropdown-content"}>
                                <Link to={CustomerRouter.dashBoardPage}>Tài khoản của tôi</Link>
                                <Link to={CustomerRouter.purchasedOrderHistory}>Đơn mua</Link>
                                <Typography onClick={() => handleLogout()}>Đăng xuất</Typography>
                            </Box>
                        </Stack>
                    ) : (
                        <Stack direction={"row"} spacing={2} alignItems={"center"} className={"top-header"}
                               divider={<Divider orientation="vertical" flexItem/>} style={{textAlign: "right"}}>
                            <Link to={CustomerRouter.registerPage}>Đăng ký</Link>
                            <Link to={CustomerRouter.loginPage}>Đăng nhập</Link>
                        </Stack>
                    )
                }
            </Stack>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
                <Box width={"13%"}>
                    <Link to={CustomerRouter.homePage}><img src={AssetPath.webLogoUrl} alt={"img"}
                                                            width={"70px"}/></Link>
                </Box>
                <Box
                    sx={{
                        width: "74%",
                        display: 'flex',
                        alignItems: 'center',
                        border: "1px solid var(--neutralgray-500)",
                        borderRadius: 2,
                    }}
                >
                    <IconButton type="button" sx={{width: "7%", cursor: "auto"}} aria-label="search" disableRipple
                                disableFocusRipple>
                        <SearchIcon/>
                    </IconButton>
                    <InputBase style={{width: "78%"}} onChange={handleChange} onKeyDown={handleKeyDown}
                               placeholder="Bạn tìm gì hôm nay"
                    />
                    <Divider orientation="vertical" flexItem style={{margin: "6px 0"}}/>
                    <Button variant={"text"} style={{width: "15%", color: "var(--bluebreak-700)"}}
                            onClick={() => searchProductByKeyword()}>Tìm kiếm</Button>
                </Box>
                <Box width={"13%"}>
                    <Link to={CustomerRouter.cartPage} className={"cart-icon"}>
                        <ShoppingCartOutlined style={{color: "var(--bluebreak-600)", fontSize: "24px"}}/>
                    </Link>
                </Box>
            </Stack>
        </Stack>
    );
}