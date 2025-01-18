import { useState, useEffect } from 'react';
import {
    Box,
    Select,
    MenuItem,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TableSortLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';

const MatriculeFiscaleManager = ({
    render,                 // if true, show the <Select> dropdown
    matriculeFiscale,       // currently selected matricule fiscale
    setMatriculeFiscale,    // setter for the selected matricule fiscale
}) => {
    const defaultMatricules = [
        { matricule: "ABC12345", description: "Matricule Fiscale A" },
        { matricule: "XYZ67890", description: "Matricule Fiscale B" },
        { matricule: "XXX98765", description: "Matricule Fiscale C" }
    ];

    // The main list of matricule fiscales
    const [matriculeList, setMatriculeList] = useState([]);

    // Fields for adding / editing a new matricule fiscale
    const [newMatricule, setNewMatricule] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editIndex, setEditIndex] = useState(-1);

    // Dialog state for confirming deletions
    const [dialogDelete, setDialogDelete] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    // Sorting
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('matricule');

    /**
     * Load initial data from localStorage or default values
     */
    useEffect(() => {
        const storedMatricules = JSON.parse(localStorage.getItem('matriculeList')) || defaultMatricules;
        setMatriculeList(storedMatricules);
    }, []);

    /**
     * Sorting logic
     */
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Sort the array whenever order or orderBy changes
    const sortedItems = [...(matriculeList || [])].sort((a, b) => {
        if (orderBy === 'matricule') {
            return order === 'asc'
                ? a.matricule.localeCompare(b.matricule)
                : b.matricule.localeCompare(a.matricule);
        } else {
            // Sort by "description"
            return order === 'asc'
                ? a.description.localeCompare(b.description)
                : b.description.localeCompare(a.description);
        }
    });

    /**
     * Handle adding a new Matricule
     */
    const handleAddMatricule = () => {
        if (newMatricule && newDescription) {
            const updatedList = [
                ...matriculeList,
                {
                    matricule: newMatricule.trim(),
                    description: newDescription.trim()
                }
            ];
            saveMatriculeList(updatedList);
            setNewMatricule('');
            setNewDescription('');
        }
    };

    /**
     * Save the edited item
     */
    const handleSaveMatricule = (index) => {
        const updatedList = [...matriculeList];
        updatedList[index] = {
            matricule: newMatricule.trim(),
            description: newDescription.trim()
        };
        saveMatriculeList(updatedList);
        setEditIndex(-1);
        setNewMatricule('');
        setNewDescription('');
    };

    /**
     * Start editing an existing item
     */
    const handleEditMatricule = (item, index) => {
        setEditIndex(index);
        setNewMatricule(item.matricule);
        setNewDescription(item.description);
        window.scrollTo(0, 0); // Scroll to top so user can see edit fields
    };

    /**
     * Ask for confirmation before deleting
     */
    const handleClickDelete = (index) => {
        setDeleteIndex(index);
        setDialogDelete(true);
    };

    /**
     * Confirm deletion
     */
    const handleConfirmDelete = () => {
        if (deleteIndex !== null) {
            handleDeleteMatricule(deleteIndex);
            setDeleteIndex(null);
            setDialogDelete(false);
        }
    };

    /**
     * Perform the actual deletion
     */
    const handleDeleteMatricule = (index) => {
        const updatedList = matriculeList.filter((_, idx) => idx !== index);
        saveMatriculeList(updatedList);
    };

    /**
     * Save the updated list to localStorage and refresh state
     */
    const saveMatriculeList = (newList) => {
        localStorage.setItem('matriculeList', JSON.stringify(newList));
        setMatriculeList(newList);
    };

    /**
     * If using the Select in "render" mode, update the selected matriculeFiscale
     */
    const handleChangeMatricule = (event) => {
        setMatriculeFiscale && setMatriculeFiscale(event.target.value);
    };

    return (
        <>
            <Box sx={{ p: 3, backgroundColor: 'rgb(247, 229, 216)', borderRadius: '8px' }}>
                {/* If "render" is true, we show a dropdown to select a matricule fiscale */}
                {render && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Select
                            labelId="matricule-select-label"
                            id="matricule-select"
                            value={matriculeFiscale || ''}
                            sx={{ minWidth: "200px" }}
                            onChange={handleChangeMatricule}
                        >
                            <MenuItem value={""}>
                                -- Sélectionner Matricule Fiscale --
                            </MenuItem>
                            {(matriculeList || []).map((item, index) => (
                                <MenuItem key={index} value={item.matricule}>
                                    {item.matricule} - {item.description}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                )}

                {/* If "render" is false, we show the manager interface to add / edit / delete */}
                {!render && (
                    <>
                        <Box sx={{ mb: 3 }}>
                            {/* Title above the inputs */}
                            <h2
                                style={{
                                    textAlign: 'center',
                                    marginBottom: '20px',
                                    color: '#333',
                                    fontWeight: 'bold',
                                }}
                            >
                                {"Boutiques Disponible"}
                            </h2>
                            {/* Zone de saisie pour ajouter ou modifier un matricule fiscale */}
                            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>

                                <input
                                    placeholder="Matricule Fiscale"
                                    className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                    style={{ maxWidth: "200px" }}
                                    value={newMatricule}
                                    onChange={(e) => setNewMatricule(e.target.value)}
                                />
                                <input
                                    placeholder="Description"
                                    className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                    style={{ maxWidth: "200px" }}
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                                <IconButton
                                    onClick={
                                        editIndex >= 0
                                            ? () => handleSaveMatricule(editIndex)
                                            : handleAddMatricule
                                    }
                                >
                                    {editIndex >= 0 ? <SaveIcon /> : <AddCircleOutline />}
                                </IconButton>
                            </Box>
                        </Box>
                        {/* Tableau des matricules */}
                        <TableContainer component={Paper}>
                            <Table id="matricule-table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'matricule'}
                                                direction={orderBy === 'matricule' ? order : 'asc'}
                                                onClick={() => handleRequestSort('matricule')}
                                            >
                                                Matricule
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="right">
                                            <TableSortLabel
                                                active={orderBy === 'description'}
                                                direction={orderBy === 'description' ? order : 'asc'}
                                                onClick={() => handleRequestSort('description')}
                                            >
                                                Description
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>

                                {/* <TableBody>
                                    {sortedItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'black',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                }}
                                            >
                                                {item.matricule}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: 'secondary.main',
                                                    backgroundColor: 'rgba(255, 0, 0, 0.04)',
                                                }}
                                            >
                                                {item.description}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton edge="end" aria-label="edit" onClick={() => handleEditMatricule(item, index)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleClickDelete(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody> */}
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Box>

            {/* Dialog de confirmation pour la suppression */}
            <Dialog
                id="dialog-delete-matricule"
                open={dialogDelete}
                onClose={() => setDialogDelete(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation de suppression"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Voulez-vous vraiment supprimer ce matricule fiscale ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogDelete(false)}>Annuler</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MatriculeFiscaleManager;
