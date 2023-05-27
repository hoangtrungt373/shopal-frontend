import {Box, Stack} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import PageSpinner from "../../common/share/PageSpinner";
import PageHeader from "../../common/share/PageHeader";
import {BreadcrumbItem} from "../../../model/common/BreadcrumbItem";
import {Enterprise} from "../../../model/Enterprise";
import Button from "@mui/material/Button";
import {DataGridPremium, GridColDef} from "@mui/x-data-grid-premium";
import {CustomerRegister} from "../../../model/enterprise/CustomerRegister";
import Typography from "@mui/material/Typography";
import {importRegisterCustomers} from "../../../service/membership.service";
import {ExceptionResponse} from "../../../model/exception/ExceptionResponse";
import AlertDialog from "../../common/share/AlertDialog";

interface Props {
    currentEnterprise?: Enterprise
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        title: "Customer",
        isLasted: true
    },
]

const EnterpriseCustomerRegisterManagementPage: React.FC<Props> = ({currentEnterprise}) => {

    const [isShow, setIsShow] = useState<boolean>(false);
    const [customerRegisters, setCustomerRegisters] = useState<CustomerRegister[]>([]);
    const [showAlertImport, setShowAlertImport] = useState({
        open: false,
        title: "Import uploaded customers?",
        content: null,
        acceptText: "OK",
        deniedText: "Not now",
        handleDenied: null,
        handleAccept: null
    });
    const [showAlert, setShowAlert] = useState({
        open: false,
        title: "Import successfully!",
        handleAccept: () => {
            setShowAlert(prevState1 => ({
                ...prevState1,
                open: false,
            }));
        },
        handleDenied: () => {
            setShowAlert(prevState1 => ({
                ...prevState1,
                open: false,
            }));
        }
    });

    useEffect(() => {
        setIsShow(true)
    }, []);


    /*TODO: handle open file in others format (csv) -> upload file to server*/
    const onUploadFile = (event) => {
        if (event.target.files[0] && event.target.files[0].text()) {
            event.target.files[0].text()
                .then((res: string) => {
                    console.log(res);
                    setCustomerRegisters([...JSON.parse(res)]);
                })
        }
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

    // TODO: handle reimport
    const handleImport = () => {
        setShowAlertImport(prevState1 => ({
            ...prevState1,
            open: true,
            handleAccept: async () => {
                await importRegisterCustomers(customerRegisters)
                    .then((res: string) => {
                        setShowAlertImport(prevState2 => ({
                            ...prevState2,
                            open: false,
                        }));
                        setCustomerRegisters([]);
                        setShowAlert(prevState4 => ({
                            ...prevState4,
                            open: true,
                        }));
                    }).catch((err: ExceptionResponse) => {
                        console.log(err);
                    })
                console.log("accept")
            },
            handleDenied: () => {
                setShowAlertImport(prevState3 => ({...prevState3, open: false}));
            }
        }));

    }

    const DisplayAlertImport = () => {
        if (showAlertImport.open) {
            return (
                <AlertDialog isShowDeniedBtn={true}
                             isShowAcceptBtn={true}
                             deniedText={showAlertImport.deniedText} acceptText={showAlertImport.acceptText}
                             handleAccept={showAlertImport.handleAccept} handleDenied={showAlertImport.handleDenied}
                             isOpen={showAlertImport.open} title={showAlertImport.title}/>
            )
        } else {
            return null;
        }
    }

    const DisplayAlert = () => {
        if (showAlert.open) {
            return (
                <AlertDialog
                    isOpen={showAlert.open} title={showAlert.title} handleAccept={showAlert.handleAccept}
                    handleDenied={showAlert.handleDenied}/>
            )
        } else {
            return null;
        }
    }

    // TODO Add import history
    if (isShow) {
        return (
            <Stack spacing={2}>
                <DisplayAlertImport/>
                <DisplayAlert/>
                <PageHeader breadCrumbItems={breadCrumbItems} title={"Customer"}/>
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>
                    <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                        <Button variant="contained" component="label">
                            Upload register customer here
                            <input hidden accept="*" multiple type="file" onChange={onUploadFile}/>
                        </Button>
                        <Button variant="outlined" component="label" disabled={customerRegisters.length == 0}
                                onClick={() => handleImport()}>
                            Import
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
                <Box className={"content-box"} sx={{display: "flex", gap: 2, flexDirection: "column"}}>

                </Box>
            </Stack>
        );
    } else {
        return (
            <PageSpinner/>
        )
    }

}

export default EnterpriseCustomerRegisterManagementPage;