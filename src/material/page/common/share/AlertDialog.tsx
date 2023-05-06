import * as React from 'react';
import {Component, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
    content?: Component | any,
    handleAccept?: Function,
    handleDenied?: Function,
    acceptText?: string,
    deniedText?: string,
    title: string,
    isOpen: boolean,
    isShowContent?: boolean,
    isShowAcceptBtn?: boolean,
    isShowDeniedBtn?: boolean,
}

const AlertDialog: React.FC<Props> = ({
                                          title,
                                          content,
                                          handleAccept,
                                          handleDenied,
                                          acceptText,
                                          deniedText,
                                          isOpen,
                                          isShowAcceptBtn,
                                          isShowDeniedBtn,
                                          isShowContent
                                      }) => {
    const [open, setOpen] = useState(isOpen);

    const handleDisagree = () => {
        if (handleDenied != undefined) {
            handleDenied();
        }
    };

    const handleAgree = () => {
        if (handleAccept != undefined) {
            handleAccept();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleDisagree}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            {
                isShowContent && (
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {content}
                        </DialogContentText>
                    </DialogContent>
                )
            }
            <DialogActions>
                {
                    isShowDeniedBtn && (
                        <Button onClick={handleDisagree} variant={"outlined"}>{deniedText ? deniedText : "Denied"}</Button>
                    )
                }
                {
                    isShowAcceptBtn && (
                        <Button onClick={handleAgree} variant={"contained"} style={{marginLeft: "16px"}}>
                            {acceptText ? acceptText : "Accept"}
                        </Button>
                    )
                }
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;