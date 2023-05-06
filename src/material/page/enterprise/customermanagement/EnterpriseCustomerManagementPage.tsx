import {Box, Tabs} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {CustomerMembership} from "../../../model/enterprise/CustomerMembership";
import {getCustomerMembershipForCurrentEnterprise} from "../../../service/enterprise.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import {DataGridPremium, GridColDef} from "@mui/x-data-grid-premium";
import Typography from "@mui/material/Typography";
import Tab from '@mui/material/Tab';
import PageSpinner from "../../common/share/PageSpinner";
import './enterprisecustomermanagement.css';
import Button from "@mui/material/Button";
import {CustomerRegister} from "../../../model/enterprise/CustomerRegister";

interface FileContent {
    fullName: string
}

interface Props {
    children?: React.ReactNode;
    index?: number;
    value?: number;
    customerMemberships?: CustomerMembership[]
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props: Props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const CustomerMembershipTable: React.FC<Props> = ({customerMemberships}) => {

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'fullName',
            headerName: 'Full name',
            width: 150,
        },
        {
            field: 'genderDescription',
            headerName: 'Gender',
        },
        {
            field: 'birthDate',
            headerName: 'Birth Date',
            width: 150,
        },
        {
            field: 'availablePoint',
            headerName: 'Available Point',
            width: 200
        },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={customerMemberships}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    )
}

const CustomerRegisterTable: React.FC<Props> = ({}) => {

    const [customerRegisters, setCustomerRegisters] = useState<CustomerRegister[]>([])

    /*TODO: handle open file in others format (csv) -> upload file to server*/
    const onUploadFile = (event) => {
        event.target.files[0].text()
            .then((res: string) => {
                setCustomerRegisters(JSON.parse(res));
            })
    };


    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'fullName',
            headerName: 'Full name',
            width: 150,
        },
        {
            field: 'registerEmail',
            headerName: 'Email',
        },
        {
            field: 'registerPhoneNumber',
            headerName: 'Phone',
            width: 150,
        },
        {
            field: 'initialPoint',
            headerName: 'Initital Point',
            width: 200
        },
    ];

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                <Button variant="contained" component="label">
                    Upload register customer here
                    <input hidden accept="image/*" multiple type="file" onChange={onUploadFile}/>
                </Button>
            </Box>
            <Typography variant={"h6"}>Preview data</Typography>
            <Box sx={{width: '100%'}}>
                <DataGridPremium
                    rows={customerRegisters}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        </Box>
    )
}

export const EnterpriseCustomerManagementPage: React.FC<Props> = ({}) => {

    const [customerMemberships, setCustomerMemberships] = useState<CustomerMembership[]>([]);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [tabValue, setTabValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        getCustomerMembershipForCurrentEnterprise()
            .then((resCustomerMemberships: CustomerMembership[]) => {
                setCustomerMemberships(resCustomerMemberships);
                setIsShow(true);
            })
            .catch((err: ExceptionResponse) => {
                console.log(err);
            });
    }, []);

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Customer membership" {...a11yProps(0)} />
                    <Tab label="Customer register" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
                {
                    isShow ? (
                        <CustomerMembershipTable customerMemberships={customerMemberships}/>
                    ) : (
                        <PageSpinner/>

                    )
                }
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <CustomerRegisterTable/>
            </TabPanel>
        </Box>
    );
}