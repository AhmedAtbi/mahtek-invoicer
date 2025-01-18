import React, { useCallback, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import n2words from 'n2words';

import { useFormState } from './useFormState'; // your custom hook
import {
    Container, Grid, Checkbox, Button, Select, MenuItem,
    IconButton
} from '@mui/material';

/**
 * Helper function to compute the total price (TTC) for all articles
 */
const computeTotalPrixTTC = (items) => {
    return items.reduce((acc, item) => {
        // total each row = prixTTC * quantite
        return acc + (item.prixTTC * item.quantite);
    }, 0);
};

/**
 * Generates the print content (HTML) for printing
 */
const generatePrintContent = ({
    isMOTOForm,
    dateInvoice,
    client,
    cin,
    address,
    items,
    matriculeFiscale,
    matriculeFiscaleList,
}) => {
    const selectedShop = matriculeFiscaleList.find(
        (item) => item.matriculeFiscale === matriculeFiscale
    );
    const shopName = selectedShop ? selectedShop.shop : "N/A";
    const totalPrixTTC = items.reduce((total, item) => total + item.prixTTC * item.quantite, 0).toFixed(2);
    const totalPrixTTCInWords = n2words(totalPrixTTC, { lang: 'fr' });

    return `
  <html>
    <head>
      <title>Facture</title>
      <style>
        @media print {
          body {
            margin: 2cm; /* Ensure proper A4 page margins */
          }
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 14px;
          margin: 20px;
        }
        h1, h2, h3 {
          text-align: center;
          margin: 15px 0;
        }
        p {
          margin: 10px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
        }
        th, td {
          border: 1px solid #000;
          padding: 10px;
          text-align: center;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #000;
        }
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
        }
        .signature-section .signature {
          text-align: right;
          width: 40%;
        }
        .signature-section .signature::after {
          content: '';
          display: block;
          width: 200px;
          height: 1px;
          background: #000;
          margin-top: 20px;
        }
        .footer .shop-info {
          margin-top: 30px;
          text-align: left;
        }
        .total-row {
          font-weight: bold;
          background-color: #f0f0f0;
        }
      </style>
    </head>
    <body>
      <h1>Facture</h1>

      <div style="margin-bottom: 20px;">
        <p><strong>Date:</strong> ${dateInvoice}</p>
        <p><strong>Client:</strong> ${client}</p>
        <p><strong>CIN:</strong> ${cin}</p>
        <p><strong>Adresse:</strong> ${address}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Type d'Article</th>
            <th>Modèle</th>
            ${isMOTOForm ? '<th>Désignation</th><th>Couleur</th>' : ''}
            <th>Quantité</th>
            <th>Prix HT</th>
            <th>Prix TTC</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${isMOTOForm ? 'MOTOCYCLE' : item.typeArticle}</td>
              <td>${item.modele}</td>
              ${isMOTOForm ? `<td>${item.designation || ''}</td><td>${item.couleur || ''}</td>` : ''}
              <td>${Number(item.quantite)}</td>
              <td>${Number(item.prixHT).toFixed(2)}</td>
              <td>${Number(item.prixTTC).toFixed(2)}</td>
            </tr>`).join('')}
            <tr class="total-row">
              <td colspan="${isMOTOForm ? 5 : 4}">Total (Prix TTC)</td>
              <td>${totalPrixTTC} TND</td>
            </tr>
        </tbody>
      </table>

      <div class="footer">
        <p>Arrêt de la présente facture à la somme de: <strong> ${totalPrixTTCInWords} dinars </strong></p>

        <div class="signature-section">
          <div class="signature">
            <strong>Cachet et Signature</strong>
          </div>
        </div>

        <div class="shop-info">
          <p><strong>${shopName}</strong></p>
          <p>8030 GROMBALIA</p>
          <p><strong>MF:</strong> ${matriculeFiscale}</p>
        </div>
      </div>
    </body>
  </html>
  `;

};




const FormService = ({ handleClose }) => {
    const {
        isMOTOForm, setIsMOTOForm,
        dateInvoice, setDateInvoice,
        client, setClient,
        cin, setCin,
        address, setAddress,
        matriculeFiscale, setMatriculeFiscale,
        items, setItems,
        matriculeFiscaleList,
    } = useFormState();


    // Utility for precise division
    const preciseDivide = (a, b) => Math.round((a / b) * 100) / 100;

    // Utility for precise multiplication
    const preciseMultiply = (a, b) => Math.round(a * b * 100) / 100;


    useEffect(() => {
        const updated = items.map((item) => {
            const newTTC = preciseMultiply(item.prixHT || 0, 1 + parseFloat(item.tvaRate || 0) / 100);
            return { ...item, prixTTC: newTTC };
        });

        // Check if the new array is different from the current state
        const isChanged = updated.some((newItem, index) => newItem.prixTTC !== items[index].prixTTC);

        if (isChanged) {
            setItems(updated); // Only update state if necessary
        }
    }, [items, setItems]);


    // Memoize the setItems function
    const memoizedSetItems = useCallback((newItems) => {
        setItems(newItems);
    }, [setItems]);

    useEffect(() => {
        memoizedSetItems(() => {
            if (isMOTOForm) {
                return [{
                    typeArticle: 'MOTOCYCLE',
                    modele: '',
                    designation: '',
                    couleur: '',
                    quantite: 0,
                    prixHT: 0,
                    prixTTC: 0,
                    tvaRate: 0,
                }];
            } else {
                return [{
                    typeArticle: '',
                    modele: '',
                    designation: '',
                    couleur: '',
                    quantite: 0,
                    prixHT: 0,
                    prixTTC: 0,
                    tvaRate: 0,
                }];
            }
        });
    }, [isMOTOForm, memoizedSetItems]);



    // 1) Create a handler for deleting an article by index
    const handleDeleteItem = (index) => {
        // Filter out the item at 'index'
        setItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };

    // Compute total PrixTTC across all articles
    const totalPrixTTC = computeTotalPrixTTC(items);

    /**
     * Add a new article
     */
    const addItem = () => {
        setItems(prev => [
            ...prev,
            {
                typeArticle: isMOTOForm ? 'MOTOCYCLE' : '',
                modele: '',
                designation: '',
                couleur: '',
                quantite: 0,
                prixHT: 0,
                prixTTC: 0,
                tvaRate: 0
            },
        ]);
    };


    const handleItemChange = (index, field, value) => {
        const updated = [...items];

        // Update the field value
        updated[index][field] = value;

        // Parse necessary values
        const tvaRate = parseFloat(updated[index].tvaRate || 0);
        const prixTTC = parseFloat(updated[index].prixTTC || 0);
        const prixHT = parseFloat(updated[index].prixHT || 0);

        if (field === "prixTTC" || field === "tvaRate") {
            if (!isNaN(tvaRate) && !isNaN(prixTTC)) {
                // Update HT using precise division
                updated[index].prixHT = preciseDivide(prixTTC, 1 + tvaRate / 100);
            }
        }

        if (field === "prixHT" || field === "tvaRate") {
            if (!isNaN(tvaRate) && !isNaN(prixHT)) {
                // Update TTC using precise multiplication
                updated[index].prixTTC = preciseMultiply(prixHT, 1 + tvaRate / 100);
            }
        }

        // Update the state
        setItems(updated);
    };



    /**
     * Clear all fields
     */
    const clearInput = () => {
        setIsMOTOForm(false);
        setDateInvoice('');
        setClient('');
        setCin('');
        setAddress('');
        setMatriculeFiscale('');
        setItems([{
            typeArticle: '',
            modele: '',
            designation: '',
            couleur: '',
            quantite: 0,
            prixHT: '',
            prixTTC: 0
        }]);
    };

    /**
     * Print logic
     */
    const printForm = useCallback(() => {
        const printContent = generatePrintContent({
            isMOTOForm,
            dateInvoice,
            client,
            cin,
            address,
            items,
            matriculeFiscale,
            matriculeFiscaleList
        });
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    }, [isMOTOForm, dateInvoice, client, cin, address, items, matriculeFiscale, matriculeFiscaleList]);

    /**
     * Submit => print and close (if handleClose is provided)
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        // Any validation logic
        printForm();
        handleClose && handleClose();
    };

    return (
        <Container maxWidth="xl">
            <form onSubmit={handleSubmit} id="invoiceForm">
                <div
                    style={{
                        backgroundColor: "#F7E5D8",
                        padding: "30px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                >
                    <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontWeight: "bold", }}>
                        {isMOTOForm ? "Facture MOTO" : "Facture GSM"}
                    </h1>

                    <Grid container spacing={4}>
                        {/* Toggle Facture Type */}
                        <Grid item xs={12}>
                            <label style={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "bold",
                                color: "#444",
                                width: "500px"
                            }}>
                                <Checkbox
                                    checked={isMOTOForm}
                                    onChange={(e) => setIsMOTOForm(e.target.checked)}
                                    style={{ marginRight: "10px" }}
                                />
                                Facture MOTO (Décochez pour Facture Autre)
                            </label>
                        </Grid>

                        {/* Date */}
                        <Grid item xs={6}>
                            <label style={{ fontWeight: "bold", color: "#444" }}>Date de la Facture</label>
                            <input
                                type="date"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    marginTop: "8px",
                                }}
                                value={dateInvoice}
                                onChange={(e) => setDateInvoice(e.target.value)}
                            />
                        </Grid>

                        {/* Client */}
                        <Grid item xs={6}>
                            <label style={{ fontWeight: "bold", color: "#444" }}>Client</label>
                            <input
                                type="text"
                                placeholder="Nom du Client"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    marginTop: "8px",
                                }}
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                            />
                        </Grid>

                        {/* CIN */}
                        <Grid item xs={6}>
                            <label style={{ fontWeight: "bold", color: "#444" }}>C.I.N/Passeport</label>
                            <input
                                type="text"
                                placeholder="C.I.N/Passeport du Client"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    marginTop: "8px",
                                }}
                                value={cin}
                                onChange={(e) => setCin(e.target.value)}
                            />
                        </Grid>

                        {/* Adresse */}
                        <Grid item xs={6}>
                            <label style={{ fontWeight: "bold", color: "#444" }}>Adresse</label>
                            <input
                                type="text"
                                placeholder="Adresse du Client"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    marginTop: "8px",
                                }}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Grid>

                        {/* Matricule Fiscale */}
                        <Grid item xs={6}>
                            <label style={{ fontWeight: "bold", color: "#444" }}>Boutiques/Matricules Fiscales</label>
                            <Select
                                value={matriculeFiscale}
                                onChange={(e) => setMatriculeFiscale(e.target.value)}
                                fullWidth
                                style={{
                                    marginTop: "8px",
                                    background: "#fff",
                                    borderRadius: "6px",
                                }}
                            >
                                <MenuItem value="">-- Sélectionner Boutiques/Matricules Fiscales --</MenuItem>
                                {matriculeFiscaleList.map((item, index) => (
                                    <MenuItem key={index} value={item.matriculeFiscale}>
                                        {item.shop} - {item.matriculeFiscale}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        {/* Articles Table */}
                        <Grid item xs={12}>
                            <h3 style={{ marginBottom: "20px", color: "#333" }}>Articles</h3>
                            {items.map((item, index) => (
                                <Grid container spacing={2} key={index} style={{ marginBottom: "20px" }}>
                                    <Grid item xs={2}>
                                        <label style={{ fontWeight: "bold", color: "#444" }}>Type d'Article</label>
                                        <input
                                            type="text"
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                fontSize: "16px", // Increase font size
                                                borderRadius: "6px",
                                                border: "1px solid #ccc",
                                                marginTop: "8px",
                                                whiteSpace: "nowrap", // Prevent text wrapping
                                                overflow: "hidden", // Hide overflowing text
                                                textOverflow: "ellipsis", // Add ellipsis for overflow
                                            }}
                                            value={isMOTOForm ? "MOTOCYCLE" : item.typeArticle}
                                            disabled={isMOTOForm}
                                            onChange={(e) => handleItemChange(index, 'typeArticle', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <label style={{ fontWeight: "bold", color: "#444" }}>Modèle</label>
                                        <input
                                            type="text"
                                            style={{
                                                width: "100%",
                                                padding: "12px",
                                                fontSize: "16px", // Increase font size
                                                borderRadius: "6px",
                                                border: "1px solid #ccc",
                                                marginTop: "8px",
                                                whiteSpace: "nowrap", // Prevent text wrapping
                                                overflow: "hidden", // Hide overflowing text
                                                textOverflow: "ellipsis", // Add ellipsis for overflow
                                            }}
                                            value={item.modele}
                                            onChange={(e) => handleItemChange(index, 'modele', e.target.value)}
                                        />
                                    </Grid>

                                    {isMOTOForm && (
                                        <>
                                            <Grid item xs={2}>
                                                <label style={{ fontWeight: "bold", color: "#444" }}>Désignation</label>
                                                <input
                                                    type="text"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px",
                                                        borderRadius: "6px",
                                                        border: "1px solid #ccc",
                                                        marginTop: "8px",
                                                    }}
                                                    value={item.designation}
                                                    onChange={(e) => handleItemChange(index, 'designation', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item xs={2}>
                                                <label style={{ fontWeight: "bold", color: "#444" }}>Couleur</label>
                                                <input
                                                    type="text"
                                                    style={{
                                                        width: "100%",
                                                        padding: "10px",
                                                        borderRadius: "6px",
                                                        border: "1px solid #ccc",
                                                        marginTop: "8px",
                                                    }}
                                                    value={item.couleur}
                                                    onChange={(e) => handleItemChange(index, 'couleur', e.target.value)}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                    <Grid item xs={1}>
                                        <label style={{ fontWeight: "bold", color: "#444" }}>Quantité</label>
                                        <input
                                            type="number"
                                            style={{
                                                width: "100%",
                                                padding: "10px",
                                                borderRadius: "6px",
                                                border: "1px solid #ccc",
                                                marginTop: "8px",
                                            }}
                                            value={item.quantite}
                                            onChange={(e) => handleItemChange(index, 'quantite', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <label style={{ fontWeight: "bold", color: "#444" }}>Prix HT</label>
                                        <input
                                            type="number"
                                            style={{
                                                width: "100%",
                                                padding: "10px",
                                                borderRadius: "6px",
                                                border: "1px solid #ccc",
                                                marginTop: "8px",
                                            }}
                                            value={item.prixHT}
                                            onChange={(e) => handleItemChange(index, 'prixHT', e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <label style={{ fontWeight: "bold", color: "#444" }}>Taux TVA</label>
                                        <input
                                            type="text"
                                            style={{
                                                width: "100%",
                                                padding: "10px",
                                                borderRadius: "6px",
                                                border: "1px solid #ccc",
                                                marginTop: "8px",
                                            }}
                                            value={`${item.tvaRate || ''}%`} // Ensures the value always includes %
                                            onChange={(e) => {
                                                const inputValue = e.target.value.replace('%', ''); // Remove the % sign for processing
                                                const numericValue = inputValue.replace(/\D/g, ''); // Allow only numbers
                                                handleItemChange(index, 'tvaRate', numericValue); // Update the numeric value in the state
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <label style={{ fontWeight: "bold", color: "#444" }}>Prix TTC</label>
                                        <input
                                            type="number"
                                            style={{
                                                width: "100%",
                                                padding: "10px",
                                                borderRadius: "6px",
                                                border: "1px solid #ccc",
                                                marginTop: "8px",
                                            }}
                                            onChange={(e) => handleItemChange(index, "prixTTC", e.target.value)}
                                            value={item.prixTTC ? Number(item.prixTTC).toFixed(2) : '0.00'} // Safely handle non-numeric values
                                        />
                                    </Grid>
                                    <Grid item xs={1} style={{ display: "flex", alignItems: "flex-end" }}>
                                        <IconButton
                                            onClick={() => handleDeleteItem(index)}
                                        >
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                variant="contained"
                                onClick={addItem}
                                style={{
                                    backgroundColor: "#28A745",
                                    color: "#fff",
                                }}
                            >
                                Ajouter un article
                            </Button>
                        </Grid>

                        {/* Total Prix TTC */}
                        <Grid item xs={12} style={{ textAlign: "right", marginTop: "20px" }}>
                            <h3 style={{ color: "#444" }}>Total Prix TTC: {totalPrixTTC.toFixed(2)} TND</h3>
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item xs={12} style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                            <Button
                                variant="contained"
                                onClick={clearInput}
                                style={{
                                    backgroundColor: "#007BFF",
                                    color: "#fff",
                                    padding: "10px 20px",
                                }}
                            >
                                Réinitialiser
                            </Button>
                            <Button
                                variant="contained"
                                type="submit"
                                style={{
                                    backgroundColor: "#28A745",
                                    color: "#fff",
                                    padding: "10px 20px",
                                }}
                            >
                                Valider
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </form>
        </Container>
    );
};

export default React.memo(FormService);
