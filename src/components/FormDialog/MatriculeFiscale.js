import { useState, useEffect } from 'react';
import {
    Box,
    Select,
    MenuItem,
    Table,
    TableBody,
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
    Button,
} from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const MatriculeFiscaleManager = ({
    render,
    matriculeFiscale,
    setMatriculeFiscale,
}) => {
    const defaultMatricules = [
        { matriculeFiscale: "ABC12345", shop: "Boutique A" },
        { matriculeFiscale: "XYZ67890", shop: "Boutique B" },
        { matriculeFiscale: "XXX98765", shop: "Boutique C" },
    ];

    const [matriculeList, setMatriculeList] = useState([]);
    const [newShop, setNewShop] = useState('');
    const [newMatriculeFiscale, setNewMatriculeFiscale] = useState('');
    const [editIndex, setEditIndex] = useState(-1);
    const [dialogDelete, setDialogDelete] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('shop');

    // Load initial data from localStorage or defaults
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('matriculeList')) || defaultMatricules;
        setMatriculeList(stored);
    }, []);

    // Save data to localStorage
    const saveMatriculeList = (list) => {
        localStorage.setItem('matriculeList', JSON.stringify(list));
        setMatriculeList(list);
    };

    // Sorting logic
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedItems = [...(matriculeList || [])].sort((a, b) => {
        return order === 'asc'
            ? a[orderBy].localeCompare(b[orderBy])
            : b[orderBy].localeCompare(a[orderBy]);
    });

    // Add new entry
    const handleAddMatricule = () => {
        if (!newShop.trim() || !newMatriculeFiscale.trim()) return;
        const updated = [
            ...matriculeList,
            { shop: newShop.trim(), matriculeFiscale: newMatriculeFiscale.trim() },
        ];
        saveMatriculeList(updated);
        setNewShop('');
        setNewMatriculeFiscale('');
    };

    // Edit existing entry
    const handleEditMatricule = (item, index) => {
        setEditIndex(index);
        setNewShop(item.shop);
        setNewMatriculeFiscale(item.matriculeFiscale);
    };

    // Save edited entry
    const handleSaveMatricule = () => {
        const updated = [...matriculeList];
        updated[editIndex] = {
            shop: newShop.trim(),
            matriculeFiscale: newMatriculeFiscale.trim(),
        };
        saveMatriculeList(updated);
        setEditIndex(-1);
        setNewShop('');
        setNewMatriculeFiscale('');
    };

    // Delete an entry
    const handleClickDelete = (index) => {
        setDeleteIndex(index);
        setDialogDelete(true);
    };

    const handleConfirmDelete = () => {
        if (deleteIndex !== null) {
            const updated = matriculeList.filter((_, i) => i !== deleteIndex);
            saveMatriculeList(updated);
            setDialogDelete(false);
            setDeleteIndex(null);
        }
    };

    // Render dropdown if `render` is true
    if (render) {
        return (
            <Box>
                <Select
                    labelId="matricule-select-label"
                    id="matricule-select"
                    value={matriculeFiscale || ''}
                    sx={{ minWidth: "200px", background: "#fff" }}
                    onChange={(e) => setMatriculeFiscale(e.target.value)}
                >
                    <MenuItem value="">-- Sélectionner Boutiques/Matricules Fiscales --</MenuItem>
                    {matriculeList.map((item, idx) => (
                        <MenuItem key={idx} value={item.matriculeFiscale}>
                            {item.shop} - {item.matriculeFiscale}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        );
    }

    // Render manager UI
    return (
        <Box sx={{ p: 3, backgroundColor: 'rgb(247, 229, 216)', borderRadius: '8px' }}>
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <input
                    placeholder="Boutique"
                    className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                    style={{ maxWidth: "200px" }}
                    value={newShop}
                    onChange={(e) => setNewShop(e.target.value)}
                />
                <input
                    placeholder="Matricule Fiscale"
                    className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                    style={{ maxWidth: "200px" }}
                    value={newMatriculeFiscale}
                    onChange={(e) => setNewMatriculeFiscale(e.target.value)}
                />
                {editIndex >= 0 ? (
                    <IconButton onClick={handleSaveMatricule}>
                        <SaveIcon />
                    </IconButton>
                ) : (
                    <IconButton onClick={handleAddMatricule}>
                        <AddCircleOutline />
                    </IconButton>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'shop'}
                                    direction={order}
                                    onClick={() => handleRequestSort('shop')}
                                >
                                    Boutique
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'matriculeFiscale'}
                                    direction={order}
                                    onClick={() => handleRequestSort('matriculeFiscale')}
                                >
                                    Matricule Fiscale
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedItems.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{item.shop}</TableCell>
                                <TableCell>{item.matriculeFiscale}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEditMatricule(item, idx)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleClickDelete(idx)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={dialogDelete} onClose={() => setDialogDelete(false)}>
                <DialogTitle>Confirmation de suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Voulez-vous vraiment supprimer ce matricule fiscale ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogDelete(false)}>Annuler</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>Supprimer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MatriculeFiscaleManager;
