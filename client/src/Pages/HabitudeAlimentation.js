import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import backArrow2 from '../ressources/backArrow2.png';
import NavBar from "../Components/NavBar";
import Footer from '../Components/Footer';
import FormularNavigator from '../Components/FormularNavigator';
import styles from '../Styles/HabitudeAlimentation.module.css';
import AlimentationRow from '../Components/Alimentation/AlimentationRow';

const HabitudeAlimentation = () => {
    const navigate = useNavigate();
    const [totalCO2, setTotalCO2] = useState(0);
    const [AlimentationBoxes, setAlimentationBoxes] = useState([]);

    const removeAlimentation = index => {
        console.log("removeAlimentation", index);
        const newAlimentation = AlimentationBoxes.filter((_, idx) => idx !== index);
        setAlimentationBoxes(newAlimentation);

        // Mettre à jour sessionStorage avec les nouvelles données
        sessionStorage.setItem('alimentationData', JSON.stringify(newAlimentation));

        // Recalculer le total de CO2 si nécessaire
        const totalCO2 = newAlimentation.reduce((acc, box) => acc + box.co2_emitted, 0);
        setTotalCO2(totalCO2.toFixed(4));
    };

    const addAlimentation = () => {
        const newAlimentation = {
            id: Date.now(),
            typeAliments: '',
            nameAliments: '',
            consommations: 1,
            co2_emitted: 0
        };
        setAlimentationBoxes([...AlimentationBoxes, newAlimentation]);
        window.scrollTo(0, document.body.scrollHeight);
    };


    const FormularBack = () => {
        sessionStorage.setItem('alimentationData', JSON.stringify(AlimentationBoxes));
        navigate('/habitudeNumerique');
    };

    const FormularContinue = () => {
        sessionStorage.setItem('alimentationData', JSON.stringify(AlimentationBoxes));
        navigate('/bilan');
    };

    useEffect(() => {
        const savedData = sessionStorage.getItem('alimentationData');
        if (savedData) {
            const alimentationData = JSON.parse(savedData);
            setAlimentationBoxes(alimentationData);
        }
    }, []);


    const updateField = (index, fieldName, newValue) => {
        if (fieldName === "co2_emitted" && isNaN(parseFloat(newValue))) {
            console.error("Invalid input for co2_emitted:", newValue);
            return;
        }

        const updatedBoxes = AlimentationBoxes.map((box, idx) =>
            idx === index ? { ...box, [fieldName]: fieldName === "co2_emitted" ? parseFloat(newValue) : newValue } : box
        );

        setAlimentationBoxes(updatedBoxes);
    };

    useEffect(() => {
        const totalFromBoxes = AlimentationBoxes.reduce((acc, box) => acc + (box.co2_emitted || 0), 0);

        // Mettre à jour le total spécifique pour cette page
        sessionStorage.setItem('HA_totalCO2', totalFromBoxes.toFixed(4));

        // Récupération des totaux des autres pages
        const HT_totalCO2 = parseFloat(sessionStorage.getItem('HT_totalCO2') || 0);
        const HN_totalCO2 = parseFloat(sessionStorage.getItem('HN_totalCO2') || 0);

        // Calcul du total général
        const totalGeneral = totalFromBoxes + HT_totalCO2 + HN_totalCO2;

        // Stockage du total général dans sessionStorage
        sessionStorage.setItem('totalCO2', totalGeneral.toFixed(4));

        // Mise à jour de l'état local pour affichage
        setTotalCO2(totalGeneral.toFixed(4));
    }, [AlimentationBoxes]);


    return (
        <div>
            <NavBar />
            <FormularNavigator />
            <div className={styles.backarrowHabitude} onClick={FormularBack}>
                <div>
                    <Link to="/habitudeNumerique">
                        <img src={backArrow2} alt="Logo de flèche de retour" />
                    </Link>
                </div>
                <div>Modifier habitudes numériques</div>
            </div>
            <div className={styles.container}>
                <div className={styles.principalBox}>
                    <div className={styles.titleboxAlimentation}>
                        Inscrivez vos habitudes alimentaires
                    </div>
                    {AlimentationBoxes.map((box, index) => (
                        <AlimentationRow
                            key={box.id}
                            typeAliments={box.typeAliments}
                            nameAliments={box.nameAliments}
                            consommations={box.consommations}
                            co2_emitted={box.co2_emitted}
                            updateField={(fieldName, newValue) => updateField(index, fieldName, newValue)}
                            remove={() => removeAlimentation(index)}  // Modification ici
                        />
                    ))}
                </div>
                <div className={styles.TotalCO2Alimentation}>
                    <div>CO2 TOTAL EMIS</div>
                    <div><strong>{totalCO2} KG</strong></div>
                </div>
                <div className={styles.btncontainer}>
                    <div className={styles.btn_add_Alimentation} onClick={addAlimentation}>
                        <div className={styles.circles}><div className={styles.plusTexts}>+</div></div>
                        <div className={styles.texts}>AJOUTER UN ALIMENT</div>
                    </div>
                    <div className={styles.btncontinue} onClick={FormularContinue}>CONTINUER</div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default HabitudeAlimentation;
