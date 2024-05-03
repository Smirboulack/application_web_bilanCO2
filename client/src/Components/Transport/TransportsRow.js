import React, { useState, useEffect } from 'react';
import { ReactComponent as Deletebutton } from '../../ressources/svg/DeleteButton.svg';
import { ReactComponent as Deletebutton2 } from '../../ressources/svg/DeleteButtonHoovered.svg';
import '../../Styles/component-style/TransportRowsStyle.css';
import axios from 'axios'; // Assurez-vous d'importer axios
import api from '../../api';

const TransportRow = ({ vehicle, distances, frequency, time_period, passangers, co2_emitted, updateField, remove }) => {
    const [hovered, setHovered] = useState(false);
    const [distance, setDistance] = useState(distances);
    const [frequence, setFrequence] = useState(frequency);
    const [periode, setPeriode] = useState(time_period);
    const [passagers, setPassagers] = useState(passangers);
    const [co2Emitted, setCo2Emitted] = useState(`${co2_emitted} KG`);
    const [transportSelected, setTransportSelected] = useState(vehicle);
    const [transportsFetch, setTransportsFetch] = useState([]);
    const [unite, setUnite] = useState('');

    const calculateCO2 = () => {
        if (!distance || !frequence || !passagers || !transportSelected) return;

        const transportData = transportsFetch.find(type => `${type.type_transport} - ${type.details}` === transportSelected);
        if (!transportData) {
            console.error("Type de transport sélectionné non trouvé");
            return;
        }

        const emissionFactor = transportData.co2_utilisation;
        const newCO2 = parseFloat(distance) * parseFloat(frequence) * parseInt(passagers) * emissionFactor + transportData.co2_construction;
        switch (periode) {
            case 'jour':
                setCo2Emitted(newCO2.toFixed(4));
                updateField("co2_emitted", newCO2);
                break;
            case 'semaine':
                const weeklyCO2 = newCO2 * 7;
                setCo2Emitted(weeklyCO2.toFixed(4));
                updateField("co2_emitted", weeklyCO2.toFixed(4));
                break;
            case 'mois':
                const monthlyCO2 = newCO2 * 30;
                setCo2Emitted(monthlyCO2.toFixed(4));
                updateField("co2_emitted", monthlyCO2.toFixed(4));
                break;
            case 'an':
                const yearlyCO2 = newCO2 * 365;
                setCo2Emitted(yearlyCO2.toFixed(4));
                updateField("co2_emitted", yearlyCO2.toFixed(4));
                break;
            default:
                console.error('Période inconnue:', periode);
        }
        setUnite(transportData.unite);
    };

    useEffect(() => {
        fetchTransportsFetchs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        calculateCO2();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicle, distance, frequence, passagers, periode, transportSelected]);

    const fetchTransportsFetchs = async () => {
        try {
            const response = await axios.get(`${api.getApiUrl()}/transport`);
            response.data.sort((a, b) => a.type_transport.localeCompare(b.type_transport));
            setTransportsFetch(response.data);
            if (response.data.length > 0 && !vehicle) {
                setTransportSelected(response.data[0].type_transport + ' - ' + response.data[0].details);
                updateField("vehicle", response.data[0].type_transport + ' - ' + response.data[0].details);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des types de transport:", error);
        }
    };


    const handleInputsChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'distance':
                setDistance(value);
                updateField("distances", value);
                break;
            case 'frequence':
                setFrequence(value);
                updateField("frequency", value);
                break;
            case 'passagers':
                setPassagers(value);
                updateField("passangers", value);
                break;
            case 'periode':
                setPeriode(value);
                updateField("time_period", value);
                break;
            default:
                console.error('Champ inconnu:', name);
        }
    };


    return (
        <div className='row_box'>
            <div className='type_transport'>
                <div
                    className='btndeletetransport'
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
                <div>
                    <select
                        className='inputperiode'
                        value={transportSelected}
                        onChange={(e) => { setTransportSelected(e.target.value); updateField("vehicle", e.target.value); }
                        }
                    >
                        {transportsFetch.map((type) => (
                            <option key={type.id} value={`${type.type_transport} - ${type.details}`}>
                                {type.type_transport + ' - ' + type.details}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='white_box'>
                <div className='white_box_titles'>
                    <span>DISTANCE</span>
                    <span>FREQUENCE</span>
                    <span>PERIODE</span>
                    <span>PASSAGERS</span>
                </div>
                <div className='white_box_journey_row'>
                    <div>
                        <input className='inputdistance' name='distance' type='number' placeholder='0' min='1' max='10000' value={distance} onChange={(e) => handleInputsChange(e)} />
                        <span> KM</span>
                    </div>
                    <div>
                        <input className='inputfrequence' name='frequence' type='number' placeholder='0' min='1' max='100' value={frequence} onChange={(e) => handleInputsChange(e)} />
                    </div>
                    <div>
                        X
                    </div>
                    <div>
                        <select className='inputperiode' name='periode' value={periode} onChange={(e) => handleInputsChange(e)}>
                            <option value='jour'>Jour</option>
                            <option value='semaine'>Semaine</option>
                            <option value='mois'>Mois</option>
                            <option value='an'>An</option>
                        </select>
                    </div>
                    <div>
                        <input className='inputpassager' name='passagers' type='number' placeholder='0' min='1' max='5' value={passagers} onChange={(e) => {
                            handleInputsChange(e);
                        }} />
                    </div>
                </div>
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

export default TransportRow;
