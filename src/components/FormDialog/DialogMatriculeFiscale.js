import { forwardRef, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Grid, IconButton } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Style } from '../../style';
import MatriculeFiscale from './MatriculeFiscale';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogMatriculeFiscale = ({ open, handleClose }) => {
    const [opened, setOpened] = useState(open);


    useEffect(() => {
        setOpened(open);
    }, [open]);

    return (
        <Dialog
            open={opened}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            sx={{
                '& .MuiDialog-paper': {
                    minHeight: "60%",
                    borderRadius: Style.borderRadius,
                    maxWidth: '100%',
                    py: 2,
                    px: 1.5,
                    overflow: "auto",
                    backgroundColor: "#F7E5D8"
                }
            }}
        >
            <DialogTitle
                id="alert-dialog-slide-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 0, // Remove padding bottom to align close icon to the top
                }}
            >

                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseOutlinedIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: "30px", minHeight: "65vh", display: 'flex', flexDirection: 'column', overflowY: "auto" }}>
                <MatriculeFiscale handleClose={handleClose && handleClose} />
                <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                    {/* Grid Content */}
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default DialogMatriculeFiscale;
