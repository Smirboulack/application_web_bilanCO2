import React, { useState, useEffect } from 'react';
import { ReactComponent as Deletebutton } from '../../ressources/svg/DeleteButton.svg';
import { ReactComponent as Deletebutton2 } from '../../ressources/svg/DeleteButtonHoovered.svg';
import '../../Styles/component-style/AlimentationRowStyle.css';
import axios from 'axios';
import api from '../../api';

const AlimentationRow = ({ typeAliments, nameAliments, consommations, co2_emitted, updateField, remove }) => {
    const [hovered, setHovered] = useState(false);
    const [nb_consommer, setnb_consommer] = useState(consommations);
    const [co2Emitted, setCo2Emitted] = useState(co2_emitted);
    const [typeAlimentationFetch, setTypeAlimentationFetch] = useState([]);
    const [AlimentationFetch, setAlimentationFetch] = useState([]);
    const [typeAlimentationSelected, setTypeAlimentationSelected] = useState(typeAliments);
    const [AlimentationSelected, setAlimentationSelected] = useState(nameAliments);
    const [unite, setUnite] = useState('');

    useEffect(() => {
        fetchAlimentationFetchs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        calculateCO2();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AlimentationSelected, nb_consommer]);

    useEffect(() => {
        // Update Alimentation options based on selected type
        const filteredOptions = AlimentationFetch.filter(aliment => aliment.type_aliment === typeAlimentationSelected);
        if (filteredOptions.length > 0 && !nameAliments) {
            setAlimentationSelected(filteredOptions[0].nom_aliment);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeAlimentationSelected]);

    const handle_temp_utilisation = (e) => {
        setnb_consommer(e.target.value);
        updateField('consommations', e.target.value);
    };

    function removeDuplicates(aliments) {
        const seen = new Set();
        const filteredArr = aliments.filter(el => {
            const duplicate = seen.has(el.type_aliment);
            seen.add(el.type_aliment);
            return !duplicate;
        });
        return filteredArr;
    }

    const fetchAlimentationFetchs = async () => {
        try {
            const response = await axios.get(`${api.getApiUrl()}/alimentation`);
            if (response.data && response.data.length > 0) {
                setAlimentationFetch(response.data);
                const uniqueAliments = removeDuplicates(response.data);
                uniqueAliments.sort((a, b) => a.type_aliment.localeCompare(b.type_aliment));
                setTypeAlimentationFetch(uniqueAliments);
                /* setTypeAlimentationSelected(uniqueAliments[0].type_aliment);
                setAlimentationSelected(response.data[0].nom_aliment); */
            } else {
                console.error('Pas de données reçues');
            }

            if (!nameAliments) {
                setAlimentationSelected(response.data[0].nom_aliment);
            }
            if (!typeAliments) {
                setTypeAlimentationSelected(response.data[0].type_aliment);
            }
        } catch (error) {
            console.error('Erreur API:', error);
        }
    };

    const calculateCO2 = () => {
        if (!nb_consommer || !AlimentationSelected) return;

        const alimentationData = AlimentationFetch.find(type => type.nom_aliment === AlimentationSelected);
        if (!alimentationData) {
            console.error("Type de alimentation sélectionné non trouvé");
            return;
        }

        const emissionFactor = alimentationData.total_co2 / (15);
        const newCO2 = parseFloat(nb_consommer) * emissionFactor;
        updateField("co2_emitted", newCO2.toFixed(4));
        setCo2Emitted(newCO2.toFixed(4));
        setUnite(alimentationData.unite);
    };

    return (
        <div className='AlimentationRow'>
            <div className='type_Alimentation'>
                <div
                    className='btndeleteAlimentation'
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{ cursor: 'pointer' }}
                    onClick={remove}
                >
                    {hovered ? (
                        <Deletebutton2 style={{ width: '35px', height: '35px' }} />
                    ) : (
                        <Deletebutton style={{ width: '35px', height: '35px' }} />
                    )}
                </div>
                <div className='aliment_column'>
                    <label>TYPE ALIMENTATION</label>
                    <select className='selectAlimentation'
                        value={typeAlimentationSelected}
                        onChange={(e) => { setTypeAlimentationSelected(e.target.value); updateField('typeAliments', e.target.value); }}>
                        {typeAlimentationFetch.map((typealiment, index) => (
                            <option key={index} value={typealiment.type_aliment}>
                                {typealiment.type_aliment}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='aliment_column'>
                    <label>NOM ALIMENT</label>
                    <select className='selectAlimentation'
                        value={AlimentationSelected}
                        onChange={(e) => { setAlimentationSelected(e.target.value); updateField('nameAliments', e.target.value); }}>
                        {AlimentationFetch.filter(aliment => aliment.type_aliment === typeAlimentationSelected).map((alimentation, index) => (
                            <option key={index} value={alimentation.nom_aliment}>
                                {alimentation.nom_aliment}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='aliment_column'>
                    <label>CONSOMMATION</label>
                    <input className='inputtempsutilisation' type='number' placeholder='0' min='1' value={nb_consommer} onChange={handle_temp_utilisation} />
                    <div> NB / JOURS</div>
                </div>
            </div>
            <div>
                <div className='CO2_EMIS'>
                    <div>CO2 EMIS</div>
                    <div>
                        <strong>{co2Emitted}</strong>
                        <span className='details_calcul'>💡</span>
                    </div>
                    <div>{unite}</div>
                </div>
            </div>

        </div>
    );
};

export default AlimentationRow;
