import { useState } from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import NavLinks from '../Navbar/NavLinks';
import FormGSM from '../FormDialog/FormGSM';
import DialogMatriculeFiscale from '../FormDialog/DialogMatriculeFiscale';

const NavBar = () => {
    const [isOpenGSMInvoice, setIsGSMInvoice] = useState(false);
    const [matriculeFiscaleDialog, setMatriculeFiscaleDialog] = useState(false);

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    transition: 'background-color 0.3s ease-in-out',
                    background: `white`,
                    marginBottom: "20%",
                    borderBottomLeftRadius: "20px",
                    borderBottomRightRadius: "20px",
                    backgroundColor: "rgb(247, 229, 216)"
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <NavLinks openMatriculeFiscale={setMatriculeFiscaleDialog} openDialogGSM={setIsGSMInvoice} />
                    </Box>

                    {/* Optional: Display something for smaller screens */}
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        {/* Mobile menu or icon can go here */}
                    </Box>
                </Toolbar>
            </AppBar>
            {

                <FormGSM open={isOpenGSMInvoice} handleClose={() => setIsGSMInvoice(false)} />

            }
            {

                <DialogMatriculeFiscale open={matriculeFiscaleDialog} handleClose={() => setMatriculeFiscaleDialog(false)} />

            }
        </>
    );
};

export default NavBar;

