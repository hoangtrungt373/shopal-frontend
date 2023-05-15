import * as React from "react";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";
import PageBreadCrumb from "./PageBreadCrumb";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";

interface Props {
    breadCrumbItems: BreadcrumbItem[],
    title: string
}


const PageHeader: React.FC<Props> = ({breadCrumbItems, title}) => {

    return (
        <Box sx={{display: "flex", flexDirection: "column", mb: 4}}>
            <Typography className={"page-header"}>{title}</Typography>
            <PageBreadCrumb items={breadCrumbItems}/>
        </Box>
    )
}

export default PageHeader;