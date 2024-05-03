import React, { useState, useEffect } from 'react';
import NavBar from "../Components/NavBar";
import { useNavigate } from "react-router-dom";
import FormularNavigator from '../Components/FormularNavigator';
import styles from '../Styles/HabitudeTransport.module.css';
import TransportRow from '../Components/Transport/TransportsRow';
import Footer from '../Components/Footer';

const HabitudeTransport = () => {
    const [transportBoxes, setTransportBoxes] = useState([]);
    const [totalCO2, setTotalCO2] = useState(0);
    const navigate = useNavigate();

    const addTransport = () => {
        const newTransport = {
            id: Date.now(),
            vehicle: '',
            distances: 1,
            frequency: 1,
            time_period: 'jour',
            passangers: 1,
            co2_emitted: 0,
        };
        setTransportBoxes([...transportBoxes, newTransport]);
        window.scrollTo(0, document.body.scrollHeight);
    };
    const removeTransport = index => {
        const newTransportBoxes = transportBoxes.filter((_, idx) => idx !== index);
        setTransportBoxes(newTransportBoxes);

        // Mettre à jour sessionStorage avec les nouvelles données
        sessionStorage.setItem('transportData', JSON.stringify(newTransportBoxes));

        // Recalculer le total de CO2 si nécessaire
        const totalCO2 = newTransportBoxes.reduce((acc, box) => acc + box.co2_emitted, 0);
        setTotalCO2(totalCO2.toFixed(4));
    };


    const updateField = (index, fieldName, newValue) => {
        if (fieldName === "co2_emitted" && isNaN(parseFloat(newValue))) {
            console.error("Invalid input for co2_emitted:", newValue);
            return; // Sortie précoce en cas de valeur non numérique
        }

        const updatedBoxes = transportBoxes.map((box, idx) =>
            idx === index ? { ...box, [fieldName]: fieldName === "co2_emitted" ? parseFloat(newValue) : newValue } : box
        );

        setTransportBoxes(updatedBoxes);
    };

    const FormularContinue = () => {
        sessionStorage.setItem('transportData', JSON.stringify(transportBoxes));
        navigate('/habitudeNumerique');
    };

    useEffect(() => {
        const savedData = sessionStorage.getItem('transportData');
        if (savedData) {
            const transportData = JSON.parse(savedData);
            setTransportBoxes(transportData);
        }
    }, []);

    useEffect(() => {
        const totalFromBoxes = transportBoxes.reduce((acc, box) => acc + (box.co2_emitted || 0), 0);

        // Mettre à jour le total spécifique pour cette page
        sessionStorage.setItem('HT_totalCO2', totalFromBoxes.toFixed(4));

        // Récupération des totaux des autres pages
        const HN_totalCO2 = parseFloat(sessionStorage.getItem('HN_totalCO2') || 0);
        const HA_totalCO2 = parseFloat(sessionStorage.getItem('HA_totalCO2') || 0);

        // Calcul du total général
        const totalGeneral = totalFromBoxes + HN_totalCO2 + HA_totalCO2;

        // Stockage du total général dans sessionStorage
        sessionStorage.setItem('totalCO2', totalGeneral.toFixed(4));

        // Mise à jour de l'état local pour affichage
        setTotalCO2(totalGeneral.toFixed(4));
    }, [transportBoxes]);

    return (
        <div>
            <NavBar />
            <FormularNavigator />
            <div className={styles.container}>
                <div className={styles.principalBox}>
                    <p className={styles.titleboxtransport}>Quelles distances parcourez-vous et avec quels moyens de transport ?</p>
                    {transportBoxes.map((box, index) => (
                        <TransportRow
                            key={box.id}
                            vehicle={box.vehicle}
                            distances={box.distances}
                            frequency={box.frequency}
                            periods={box.periods}
                            time_period={box.time_period}
                            passangers={box.passangers}
                            co2_emitted={box.co2_emitted}
                            updateField={(fieldName, newValue) => updateField(index, fieldName, newValue)}
                            remove={() => removeTransport(index)}
                        />
                    ))}
                </div>
                <div className={styles.TotalCO2Transport}>
                    <div>CO2 TOTAL EMIS</div>
                    <div><strong>{totalCO2} KG</strong></div>
                </div>
                <div className={styles.btncontainer}>
                    <div className={styles.btn_add_deplacement} onClick={addTransport}>
                        <div className={styles.circles}><div className={styles.plusTexts}>+</div></div>
                        <div className={styles.texts}>AJOUTER UN MODE DE DEPLACEMENT</div>
                    </div>
                    <div className={styles.btncontinue} onClick={FormularContinue} >CONTINUER</div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HabitudeTransport;
