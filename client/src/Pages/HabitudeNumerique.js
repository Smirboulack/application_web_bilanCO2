import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import backArrow2 from '../ressources/backArrow2.png';
import NavBar from "../Components/NavBar";
import FormularNavigator from '../Components/FormularNavigator';
import styles from '../Styles/HabitudeNumerique.module.css';
import NumeriqueRow from '../Components/Numerique/NumeriqueRow';
import Footer from '../Components/Footer';

const HabitudeNumerique = () => {
    const navigate = useNavigate();
    const [totalCO2, setTotalCO2] = useState(0);
    const [NumeriqueBoxes, setNumeriqueBoxes] = useState([]);

    const removeNumerique = index => {
        const newNumeriques = NumeriqueBoxes.filter((_, idx) => idx !== index);
        setNumeriqueBoxes(newNumeriques);

        // Mettre à jour sessionStorage avec les nouvelles données
        sessionStorage.setItem('numeriqueData', JSON.stringify(newNumeriques));

        // Recalculer le total de CO2 si nécessaire
        const totalCO2 = newNumeriques.reduce((acc, box) => acc + box.co2_emitted, 0);
        setTotalCO2(totalCO2.toFixed(4));
    };

    const addNumerique = () => {
        const newNumerique = {
            id: Date.now(),
            numerique_choosen: '',
            frequency: 1,
            co2_emitted: 0
        };
        setNumeriqueBoxes([...NumeriqueBoxes, newNumerique]);
        window.scrollTo(0, document.body.scrollHeight);
    }

    const updateField = (index, fieldName, newValue) => {
        if (fieldName === "co2_emitted" && isNaN(parseFloat(newValue))) {
            console.error("Invalid input for co2_emitted:", newValue);
            return;
        }

        const updatedBoxes = NumeriqueBoxes.map((box, idx) =>
            idx === index ? { ...box, [fieldName]: fieldName === "co2_emitted" ? parseFloat(newValue) : newValue } : box
        );

        setNumeriqueBoxes(updatedBoxes);
    };

    const FormularBack = () => {
        sessionStorage.setItem('numeriqueData', JSON.stringify(NumeriqueBoxes));
        navigate('/habitudeTransport');
    };

    const FormularContinue = () => {
        sessionStorage.setItem('numeriqueData', JSON.stringify(NumeriqueBoxes));
        navigate('/habitudeAlimentation');
    };

    useEffect(() => {
        const savedData = sessionStorage.getItem('numeriqueData');
        if (savedData) {
            const numeriqueData = JSON.parse(savedData);
            setNumeriqueBoxes(numeriqueData);
        }
    }, []);


    useEffect(() => {
        const totalFromBoxes = NumeriqueBoxes.reduce((acc, box) => acc + (box.co2_emitted || 0), 0);

        // Mettre à jour le total spécifique pour cette page
        sessionStorage.setItem('HN_totalCO2', totalFromBoxes.toFixed(4));

        // Récupération des totaux des autres pages
        const HT_totalCO2 = parseFloat(sessionStorage.getItem('HT_totalCO2') || 0);
        const HA_totalCO2 = parseFloat(sessionStorage.getItem('HA_totalCO2') || 0);

        // Calcul du total général
        const totalGeneral = totalFromBoxes + HT_totalCO2 + HA_totalCO2;

        // Stockage du total général dans sessionStorage
        sessionStorage.setItem('totalCO2', totalGeneral.toFixed(4));

        // Mise à jour de l'état local pour affichage
        setTotalCO2(totalGeneral.toFixed(4));
    }, [NumeriqueBoxes]);

    return (
        <div>
            <NavBar />
            <FormularNavigator />
            <div className={styles.backarrowHabitude} onClick={FormularBack}>
                <div>
                    <Link to="/habitudeTransport">
                        <img src={backArrow2} alt="Logo de flèche de retour" />
                    </Link>
                </div>
                <div>Modifier habitudes de transports</div>
            </div>
            <div className={styles.container}>
                <div className={styles.principalBox}>
                    <div className={styles.titleboxNumerique}>
                        Quelles sont vos habitudes numériques ?
                    </div>
                    {NumeriqueBoxes.map((box, index) => (
                        <NumeriqueRow
                            key={box.id}
                            numerique_choosen={box.numerique_choosen}
                            frequency={box.frequency}
                            co2_emitted={box.co2_emitted}
                            updateField={(fieldName, newValue) => updateField(index, fieldName, newValue)}
                            remove={() => removeNumerique(index)}
                        />
                    ))}
                </div>
                <div className={styles.TotalCO2Numerique}>
                    <div>CO2 TOTAL EMIS</div>
                    <div><strong>{totalCO2} KG</strong></div>
                </div>
                <div className={styles.btncontainer}>
                    <div className={styles.btn_add_numerique} onClick={addNumerique}>
                        <div className={styles.circles}><div className={styles.plusTexts}>+</div></div>
                        <div className={styles.texts}>AJOUTER UN APPAREIL</div>
                    </div>
                    <div className={styles.btncontinue} onClick={FormularContinue} >CONTINUER</div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HabitudeNumerique;
