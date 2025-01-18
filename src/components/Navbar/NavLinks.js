import { Style } from '../../style';
import { Button } from '@mui/material';

const NavButtons = ({ openDialogGSM, openMatriculeFiscale }) => {
    return (
        <div className="flex items-center">
            <Button
                smooth
                id="renewal-form"
                onClick={() => openDialogGSM(true)}
                sx={{
                    background: "white",
                    color: Style.greenGoCaution,
                    fontWeight: 'bold',
                    marginRight: "10px",
                    borderRadius: "20px",
                    '&:hover': {
                        color: Style.greenGoCaution,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    },
                }}
            >
                {"Creation de facture"}
            </Button>
            <Button
                smooth
                id="renewal-form"
                onClick={() => openMatriculeFiscale(true)}
                sx={{
                    background: "white",
                    color: Style.greenGoCaution,
                    fontWeight: 'bold',
                    marginRight: "10px",
                    borderRadius: "20px",
                    '&:hover': {
                        color: Style.greenGoCaution,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    },
                }}
            >
                {"Gestion de boutiques"}
            </Button>
        </div>
    );
};

export default NavButtons;
