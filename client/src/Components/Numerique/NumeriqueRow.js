import React, { useState, useEffect } from 'react';
import { ReactComponent as Deletebutton } from '../../ressources/svg/DeleteButton.svg';
import { ReactComponent as Deletebutton2 } from '../../ressources/svg/DeleteButtonHoovered.svg';
import '../../Styles/component-style/NumeriqueRowStyle.css';
import axios from 'axios';
import api from '../../api';

const NumeriqueRow = ({ numerique_choosen, frequency, co2_emitted, updateField, remove }) => {
    const [hovered, setHovered] = useState(false);
    const [frequence, setFrequence] = useState(frequency);
    const [NumeriqueSelected, setNumeriqueSelected] = useState(numerique_choosen);
    const [NumeriqueFetch, setNumeriqueFetch] = useState([]);
    const [co2Emitted, setCo2Emitted] = useState(co2_emitted);
    const [unite, setUnite] = useState('');

    useEffect(() => {
        fetchNumeriqueFetchs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Réinitialiser frequence à une valeur par défaut appropriée quand NumeriqueSelected change
        setFrequence(NumeriqueSelected.startsWith('1') ? '1' : '0.20');
    }, [NumeriqueSelected]);

    useEffect(() => {
        setFrequence(frequency);
    }, [frequency]);

    useEffect(() => {
        setNumeriqueSelected(numerique_choosen);
    }, [numerique_choosen]);

    useEffect(() => {
        setCo2Emitted(co2_emitted);
    }, [co2_emitted]);

    useEffect(() => {
        calculateCO2();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [frequence, NumeriqueSelected]);

    const calculateCO2 = () => {
        if (!frequence || !NumeriqueSelected) return;

        const numeriqueData = NumeriqueFetch.find(type => `${type.type_numerique} - ${type.details}` === NumeriqueSelected);
        if (!numeriqueData) {
            console.error("Type de numerique sélectionné non trouvé");
            return;
        }

        const emissionFactor = numeriqueData.co2_utilisation;
        let newCO2;
        NumeriqueSelected.startsWith('1') ?
            newCO2 = parseFloat(frequence) * emissionFactor :
            newCO2 = parseFloat(frequence) * emissionFactor + numeriqueData.co2_utilisation;

        setCo2Emitted(newCO2.toFixed(4));
        updateField("co2_emitted", newCO2.toFixed(4));
        setUnite(numeriqueData.unite);
    };

    const fetchNumeriqueFetchs = async () => {
        try {
            const response = await axios.get(`${api.getApiUrl()}/numerique`);
            if (response.data && response.data.length > 0) {
                response.data.sort((a, b) => a.type_numerique.localeCompare(b.type_numerique));
                setNumeriqueFetch(response.data);
                /* setNumeriqueSelected(response.data[0].type_numerique + ' - ' + response.data[0].details); */
            } else {
                console.error('Pas de données reçues');
            }
            if (!numerique_choosen) {
                setNumeriqueSelected(response.data[0].type_numerique + ' - ' + response.data[0].details);
            }
            calculateCO2();
        } catch (error) {
            console.error('Erreur API:', error);
        }
    };

    const handle_temp_utilisation = (e) => {
        setFrequence(e.target.value);
        updateField("frequency", e.target.value);
    };

    // Dynamically determine input attributes based on selected numerique type
    const inputAttributes = NumeriqueSelected.startsWith('1') ? {
        min: '1'
    } : {
        min: '0.20',
        max: '24',
        step: '0.20'
    };

    const timeLabel = NumeriqueSelected.startsWith('1') ? 'Nombres / Jour' : 'Heures / Jour';

    return (
        <div className='NumeriqueRow'>

            <div className='type_numerique'>
                <div
                    className='btndeleteNumerique'
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
                <div className='type_numerique_column'>
                    <label>TYPE NUMERIQUE</label>
                    <select className='selectNumerique'
                        value={NumeriqueSelected}
                        onChange={(e) => { setNumeriqueSelected(e.target.value); updateField("numerique_choosen", e.target.value); }}>
                        {NumeriqueFetch.map((numerique) => (
                            <option key={numerique.id} value={`${numerique.type_numerique} - ${numerique.details}`}>
                                {numerique.type_numerique + ' - ' + numerique.details}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div>
                <div className='numerique_frequence'>
                    <label>FREQUENCE</label>
                    <input className='inputtempsutilisation' type='number'
                        {...inputAttributes}
                        value={frequence}
                        onChange={handle_temp_utilisation} />
                </div>
                <span>{timeLabel}</span>
            </div>
            <div className='CO2_EMIS'>
                <div>CO2 EMIS</div>
                <div>
                    <strong>{co2Emitted}</strong>
                    <span className='details_calcul'>💡</span>
                </div>
                <div>{unite}</div>
            </div>
        </div>
    );
};

export default NumeriqueRow;