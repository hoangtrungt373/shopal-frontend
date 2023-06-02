import * as React from "react";
import {Customer} from "../../../model/Customer";
import './CustomerHomeHeader.scss'
import {Stack} from "@mui/material";
import {Link} from "react-router-dom";
import './CustomerHomeFooter.scss'
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {AssetPath} from "../../../config/router";

interface Props {
    currentCustomer?: Customer,
}

export const CustomerHomeFooter: React.FC<Props> = ({currentCustomer}) => {

    return (
        <Stack sx={{
            backgroundColor: "#fff", p: "24px 190px", width: "100%"
        }} spacing={2} direction={"row"} className={"customer-home-footer"} justifyContent={"space-between"}>
            <Stack spacing={1}>
                <Typography style={{fontWeight: "bold", fontSize: "16px"}}>Hỗ trợ khách hàng</Typography>
                <Typography
                    style={{color: "rgb(128, 128, 137)", fontSize: "12px"}}>Hotline: <strong
                    style={{color: "black"}}>1900-6035 </strong></Typography>
                <a target="_blank" href={"https://www.facebook.com/groups/744546133642630"} className={"footer-link"}>Trung
                    tâm trợ
                    giúp</a>
                <Link to={"/"} className={"footer-link"}>Hướng dẫn mua hàng</Link>
                <Link to={"/"} className={"footer-link"}>Hướng dẫn bán hàng</Link>
                <Link to={"/"} className={"footer-link"}>Vận chuyển</Link>
                <Link to={"/"} className={"footer-link"}>Trả hàng và hoàn tiền</Link>
            </Stack>
            <Stack spacing={1}>
                <Typography style={{fontWeight: "bold", fontSize: "16px"}}>Về Shopal</Typography>
                <Link to={"/"} className={"footer-link"}>Giới thiệu Shopal</Link>
                <Link to={"/"} className={"footer-link"}>Tuyển dụng</Link>
                <Link to={"/"} className={"footer-link"}>Chính sách bảo mật thông tin cá nhân</Link>
            </Stack>
            <Stack spacing={2}>
                <Stack spacing={1}>
                    <Typography style={{fontWeight: "bold", fontSize: "16px"}}>Hợp tác và liên kết</Typography>
                    <Link to={"/"} className={"footer-link"}>Quy chế hoạt động Sàn GDTMĐT</Link>
                    <Link to={"/"} className={"footer-link"}>Bán hàng cùng Shopal</Link>
                </Stack>
                <Stack spacing={1}>
                    <Typography style={{fontWeight: "bold", fontSize: "16px"}}>Chứng nhận bởi</Typography>
                    <a target="_blank" href={"https://www.facebook.com/groups/744546133642630/user/596161424/"}>
                        <img src={"https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg"}
                             style={{width: "100px"}}/>
                    </a>
                </Stack>
            </Stack>
            <Stack spacing={2}>
                <Stack spacing={1}>
                    <Typography style={{fontWeight: "bold", fontSize: "16px"}}>Phương thức thanh toán</Typography>
                    <img src={AssetPath.paymentTypeImg}
                         style={{width: "200px"}}/>
                </Stack>
                <Stack spacing={1}>
                    <Typography style={{fontWeight: "bold", fontSize: "16px"}}>Dịch vụ giao hàng</Typography>
                    <Link to={"/"}>
                        <img src={"https://salt.tikicdn.com/ts/brickv2og/1d/d4/27/c0e881ca1392ed3feff9cb5b6068d06d.png"}
                             style={{width: "100px"}}/>
                    </Link>
                </Stack>
            </Stack>
            <Stack spacing={1}>
                <Typography style={{fontWeight: "bold", fontSize: "16px"}}>Kết nối với chúng tôi</Typography>
                <Stack direction={"row"} spacing={2}>
                    <a href={""}>
                        <Avatar alt="Remy Sharp" src="https://www.facebook.com/images/fb_icon_325x325.png"
                                sx={{width: 24, height: 24}}/>
                    </a>
                    <a href={""}>
                        <Avatar alt="Remy Sharp"
                                src="https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc"
                                sx={{width: 24, height: 24}}/>
                    </a>
                    <a href={""}>
                        <Avatar alt="Remy Sharp"
                                src="https://play-lh.googleusercontent.com/rFIOt4fDSCgJh_FkHU2qP8YiZUUhfVoKoNfQFbPEM-Wl8zuyuwn7vzkEx_XMh5B6FfO3"
                                sx={{width: 24, height: 24}}/>
                    </a>
                </Stack>

            </Stack>
        </Stack>
    );
}