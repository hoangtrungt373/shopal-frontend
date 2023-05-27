import * as React from "react";
import {useEffect, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Box, Chip, Stack, Tabs, Tooltip} from "@mui/material";
import PageSpinner from "../../common/share/PageSpinner";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import Tab from "@mui/material/Tab";
import {a11yProps} from "../../common/share/a11yProps";
import {TabPanel} from "../../common/share/TabPanel";
import {getAllCreateOrUpdateContractAnn} from "../../../service/contract.service";
import {CreateOrUpdateContractRequestAnn} from "../../../model/admin/CreateOrUpdateContractRequestAnn";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {Enterprise} from "../../../model/Enterprise";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {isNotNull} from "../../../util/object.util";
import Button from "@mui/material/Button";
import {ContractChangeRequestStatus} from "../../../model/enums/ContractChangeRequestStatus";
import {createSeoLink, formatDateTime, formatVndMoney} from "../../../util/display.util";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {EnterpriseProductSellingRequestStatus} from "../../../model/enums/EnterpriseProductSellingRequestStatus";
import {EnterpriseProductSellingRequestAnn} from "../../../model/admin/EnterpriseProductSellingRequestAnn";
import {getAllEnterpriseProductSellingRequestAnn} from "../../../service/product.service";
import Avatar from "@mui/material/Avatar";
import {AdminRouter, AssetPath} from "../../../config/router";
import {
    getChipStyleEnterpriseProductSellingRequestStatus
} from "../../admin/requestsellingproductmanagement/AdminProductSellingRequestManagementPage";
import {Link} from "react-router-dom";


interface Props {
    currentEnterprise?: Enterprise
    contractRequests?: CreateOrUpdateContractRequestAnn[]
    sellingRequests?: EnterpriseProductSellingRequestAnn[]
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Notification",
        isLasted: true
    }
]

const getChipStyle = (status: ContractChangeRequestStatus) => {
    let chipBgColor = null;
    let chipTextColor = "#212121";
    switch (status) {
        case ContractChangeRequestStatus.RECEIVED: {
            chipBgColor = "#8A909D";
            chipTextColor = "#fff";
            break;
        }
        case ContractChangeRequestStatus.ACCEPT: {
            chipBgColor = "#13CAE1";
            chipTextColor = "#fff";
            break;
        }
        case ContractChangeRequestStatus.REFUSE: {
            chipBgColor = "#F44336";
            break;
        }
        default: {
            break;
        }
    }
    return {
        chipBgColor,
        chipTextColor
    }
}

const ContractList = ({contractRequests, currentEnterprise}) => {

    return (
        <Box>
            {
                contractRequests.map((contractRequest, index) => (
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                <Chip label={contractRequest.isEdit ? "Update" : "Create"} color="primary"
                                      variant="outlined" size={"small"}/>
                                <Chip label={contractRequest.contractChangeRequestStatus} size={"small"}
                                      style={{
                                          backgroundColor: getChipStyle(contractRequest.contractChangeRequestStatus).chipBgColor,
                                          color: getChipStyle(contractRequest.contractChangeRequestStatus).chipTextColor
                                      }}/>
                                <Typography>{formatDateTime(contractRequest.date)}</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Typography gutterBottom>Start Date </Typography>
                                        <TextField value={contractRequest.startDate} disabled={true}
                                                   fullWidth
                                                   size={"small"}/>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography gutterBottom>End Date </Typography>
                                        <TextField
                                            value={contractRequest.endDate} disabled={true}
                                            fullWidth
                                            size={"small"}/>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography gutterBottom>Commission Rate </Typography>
                                        <TextField
                                            value={contractRequest.commissionRate} disabled={true}
                                            fullWidth
                                            size={"small"}/>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography gutterBottom>Cash Per Point </Typography>
                                        <TextField
                                            value={contractRequest.cashPerPoint} disabled={true}
                                            fullWidth
                                            size={"small"}/>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography gutterBottom>Status</Typography>
                                        <TextField
                                            value={contractRequest.contractStatus} disabled={true}
                                            fullWidth
                                            size={"small"}/>
                                    </Grid>
                                    {
                                        (isNotNull(contractRequest.updateEndDate) && contractRequest.endDate != contractRequest.updateEndDate) ? (
                                            <Grid item xs={3}>
                                                <Typography gutterBottom>Change Request End Date </Typography>
                                                <TextField
                                                    value={contractRequest.updateEndDate} disabled={true}
                                                    fullWidth
                                                    size={"small"}/>
                                            </Grid>
                                        ) : (
                                            <Grid item xs={3}>
                                            </Grid>
                                        )
                                    }
                                    {
                                        (isNotNull(contractRequest.updateCommissionRate) && contractRequest.commissionRate != contractRequest.updateCommissionRate) ? (
                                            <Grid item xs={3}>
                                                <Typography gutterBottom>Change Request Commission
                                                    Rate </Typography>
                                                <TextField
                                                    value={contractRequest.updateCommissionRate} disabled={true}
                                                    fullWidth
                                                    size={"small"}/>
                                            </Grid>
                                        ) : (
                                            <Grid item xs={3}>
                                            </Grid>
                                        )
                                    }
                                    {
                                        (isNotNull(contractRequest.updateCashPerPoint) && contractRequest.cashPerPoint != contractRequest.updateCashPerPoint) ? (
                                            <Grid item xs={3}>
                                                <Typography gutterBottom>Change Request Cash Per Point </Typography>
                                                <TextField
                                                    value={contractRequest.updateCashPerPoint} disabled={true}
                                                    fullWidth
                                                    size={"small"}/>
                                            </Grid>
                                        ) : (
                                            <Grid item xs={3}>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                                <Grid container spacing={2} justifyContent={"flex-end"}>
                                    <Grid item xs={3}>
                                    </Grid>
                                    {
                                        contractRequest.contractChangeRequestStatus == ContractChangeRequestStatus.RECEIVED && (
                                            <Grid item xs={3}>
                                                <Button variant={"outlined"} color={"error"} fullWidth>Cancel
                                                    Request</Button>
                                            </Grid>
                                        )
                                    }
                                </Grid>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </Box>
    )
}

const SellingList = ({sellingRequests, currentEnterprise}) => {

    return (
        <Box>
            {
                sellingRequests.map((sellingRequest, index) => (
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                <Chip label={sellingRequest.enterpriseProductSellingRequestStatus}
                                      size={"small"}
                                      style={{
                                          backgroundColor: getChipStyleEnterpriseProductSellingRequestStatus(sellingRequest.enterpriseProductSellingRequestStatus).chipBgColor,
                                          color: getChipStyleEnterpriseProductSellingRequestStatus(sellingRequest.enterpriseProductSellingRequestStatus).chipTextColor
                                      }}/>
                                <Typography style={{
                                    marginLeft: "auto",
                                    textAlign: "center"
                                }}>{formatDateTime(sellingRequest.date)}</Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2
                                }}>
                                    <img src={AssetPath.productImgUrl + sellingRequest.product.mainImgUrl}
                                         style={{width: "100px", height: "100px"}}/>
                                    <Box style={{display: "flex", flexDirection: "column", gap: "8px"}}
                                         className={"product-card"}>
                                        <Box sx={{height: "32px"}}>
                                            <Link className={"product-cart-name"} style={{width: "100%"}}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  to={AdminRouter.productDetailPage + "/" + createSeoLink(sellingRequest.product.productName) + "." + sellingRequest.product.id}
                                            >{sellingRequest.product.productName}</Link>
                                        </Box>
                                        <Box>
                                            <Typography
                                                fontWeight={"bold"}>{formatVndMoney(sellingRequest.product.initialCash)}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography>Cash Per
                                                Point: {sellingRequest.cashPerPoint}</Typography>
                                        </Box>
                                        <Box sx={{
                                            display: "flex",
                                            gap: 0.5,
                                            alignItems: "center"
                                        }}>
                                            <Typography>Point
                                                Exchange: {Math.round((sellingRequest.product.initialCash / sellingRequest.cashPerPoint))}</Typography>
                                            <Tooltip
                                                title={sellingRequest.enterprise.enterpriseName}>
                                                <Avatar alt="img"
                                                        src={AssetPath.enterpriseLogoUrl + sellingRequest.enterprise.logoUrl}
                                                        sx={{width: 15, height: 15}}/>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid item xs={9}>
                                        </Grid>
                                        <Grid item xs={3}>
                                            {
                                                sellingRequest.enterpriseProductSellingRequestStatus == EnterpriseProductSellingRequestStatus.RECEIVED && (
                                                    <Button variant={"outlined"} color={"error"} fullWidth>Cancel
                                                        Request</Button>
                                                )
                                            }
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </Box>
    )
}


const EnterpriseNotificationPage: React.FC<Props> = ({currentEnterprise}) => {

    const [isShow, setIsShow] = useState<boolean>(false);
    const [notificationTab, setNotificationTab] = useState<number>(0);
    const [contractRequests, setContractRequests] = useState<CreateOrUpdateContractRequestAnn[]>()
    const [sellingRequests, setSellingRequests] = useState<EnterpriseProductSellingRequestAnn[]>()


    useEffect(() => {
        getAllCreateOrUpdateContractAnn()
            .then((resRequests: CreateOrUpdateContractRequestAnn[]) => {
                setContractRequests(resRequests.filter(x => x.enterpriseId == currentEnterprise.id));

                getAllEnterpriseProductSellingRequestAnn()
                    .then((resRequests1: EnterpriseProductSellingRequestAnn[]) => {
                        setSellingRequests(resRequests1.filter(x => x.enterpriseId == currentEnterprise.id));
                    }).catch((err: ExceptionResponse) => {
                    console.log(err);
                })

            }).catch((err: ExceptionResponse) => {
        }).finally(() => {
            setIsShow(true);
        })
    }, []);

    const handleChangeNotificationTab = (event: React.SyntheticEvent, newTab: number) => {
        setNotificationTab(newTab);
    };


    if (isShow) {
        return (
            <Stack spacing={2}>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Notification"}/>
                <Box sx={{backgroundColor: "#fff"}}>
                    <Tabs value={notificationTab} onChange={handleChangeNotificationTab}
                          style={{
                              backgroundColor: "#fff",
                              border: "1px solid var(--neutralgray-500)",
                              borderRadius: "8px"
                          }}
                          aria-label="basic tabs example">
                        <Tab label="All" {...a11yProps(0)} style={{textTransform: "initial"}}/>
                        <Tab label="Contract change request" {...a11yProps(1)} style={{textTransform: "initial"}}/>
                        <Tab label="Product selling request" {...a11yProps(2)} style={{textTransform: "initial"}}/>
                    </Tabs>
                </Box>
                <Box>
                    <TabPanel value={notificationTab} index={0} padding={0}>
                        All
                    </TabPanel>
                    <TabPanel value={notificationTab} index={1} padding={0}>
                        <ContractList contractRequests={contractRequests} currentEnterprise={currentEnterprise}/>
                    </TabPanel>
                    <TabPanel value={notificationTab} index={2} padding={0}>
                        <SellingList sellingRequests={sellingRequests} currentEnterprise={currentEnterprise}/>
                    </TabPanel>
                </Box>

            </Stack>
        )
    } else {
        return <PageSpinner/>
    }
}

export default EnterpriseNotificationPage;