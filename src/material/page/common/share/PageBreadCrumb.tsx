import {Breadcrumbs, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import './PageBreadCrumb.css';
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {CURRENT_USER_ROLE} from "../../../config/constants";
import {UserRole} from "../../../model/enums/UserRole";
import {AdminRouter, CustomerRouter, EnterpriseRouter} from "../../../config/router";

interface Props {
    items: BreadcrumbItem[]
}

const PageBreadCrumb: React.FC<Props> = ({items}) => {

    const [homeBreadCrumb, setHomeBreadcrumb] = useState<BreadcrumbItem>({url: null, title: null});

    useEffect(() => {
        let homeUrl;
        if (localStorage.getItem(CURRENT_USER_ROLE) == UserRole.ADMIN) {
            homeUrl = AdminRouter.dashboardPage;
        } else if (localStorage.getItem(CURRENT_USER_ROLE) == UserRole.ENTERPRISE_MANAGER) {
            homeUrl = EnterpriseRouter.dashboardPage;
        } else {
            homeUrl = CustomerRouter.homePage;
        }
        setHomeBreadcrumb({
            url: homeUrl,
            title: localStorage.getItem(CURRENT_USER_ROLE) == UserRole.CUSTOMER ? "Trang chủ" : "Home"
        })
    }, [items]);

    return (
        <Stack spacing={2} className={"page-breadcrumb"}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small"/>}
                aria-label="breadcrumb"
            >
                <Link to={homeBreadCrumb.url} className={"breadcrumb-link breadcrumb-link-first"}>
                    {homeBreadCrumb.title}
                </Link>
                {
                    items.map((item, index) => {
                        if (!item.isLasted) {
                            return (
                                <Link to={item.url} key={index} className={"breadcrumb-link"}>
                                    {item.title}
                                </Link>
                            )
                        } else {
                            return (
                                <Typography key={index} className={"breadcrumb-link-lasted"}>
                                    {item.title}
                                </Typography>
                            )
                        }
                    })
                }
            </Breadcrumbs>
        </Stack>
    );
}

export default PageBreadCrumb;