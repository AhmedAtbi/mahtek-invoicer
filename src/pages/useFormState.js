import { useState, useEffect } from 'react';

/**
 * Manages all the form state, including MOTO toggle, invoice data,
 * items, and the list of matricules from localStorage.
 */
export const useFormState = () => {
    // Toggle between Facture MOTO or Autre
    const [isMOTOForm, setIsMOTOForm] = useState(false);

    // Invoice details
    const [client, setClient] = useState('');
    const [cin, setCin] = useState('');
    const [address, setAddress] = useState('');

    // Matricule Fiscale states
    const [matriculeFiscale, setMatriculeFiscale] = useState('');
    const [matriculeFiscaleList, setMatriculeFiscaleList] = useState([]);
    const [dateInvoice, setDateInvoice] = useState('');

    useEffect(() => {
        if (!dateInvoice) {
            // Only set date if it's currently empty
            const today = new Date().toISOString().split('T')[0];
            setDateInvoice(today);
        }
    }, [dateInvoice]);


    // Articles
    // For MOTO: set "typeArticle" = "MOTOCYCLE" (disabled)
    // For Autre: user can set "typeArticle" freely
    // We'll compute "prixTTC" automatically.
    const [items, setItems] = useState([
        {
            typeArticle: '',
            modele: '',
            designation: '',
            couleur: '',
            quantite: 0,
            prixHT: '',
            prixTTC: 0,
            tvaRate: 0, // each article has its own default tvaRate
        },
    ]);

    useEffect(() => {
        const storedMatricules = JSON.parse(localStorage.getItem('matriculeList')) || [];
        if (storedMatricules.length > 0) {
            setMatriculeFiscaleList(storedMatricules);
        } else {
            const defaultList = [
                { matriculeFiscale: "ABC12345", shop: "Boutique A" },
                { matriculeFiscale: "XYZ67890", shop: "Boutique B" },
                { matriculeFiscale: "XXX98765", shop: "Boutique C" },
            ];
            setMatriculeFiscaleList(defaultList);
            localStorage.setItem('matriculeList', JSON.stringify(defaultList));
        }
    }, []);



    // Update localStorage whenever the list changes
    useEffect(() => {
        localStorage.setItem('matriculeList', JSON.stringify(matriculeFiscaleList));
    }, [matriculeFiscaleList]);

    return {
        isMOTOForm,
        setIsMOTOForm,

        dateInvoice,
        setDateInvoice,

        client,
        setClient,

        cin,
        setCin,

        address,
        setAddress,

        matriculeFiscale,
        setMatriculeFiscale,

        matriculeFiscaleList,
        setMatriculeFiscaleList,

        items,
        setItems,
    };
};
