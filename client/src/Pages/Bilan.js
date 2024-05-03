import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import FormularNavigator from '../Components/FormularNavigator';
import BilanChart from '../Components/BilanChart';
import { useUser } from '../Components/context/UserContext';
import '../Styles/Bilan.css';
import api from '../api';
import axios from 'axios'; // Import Axios

const Bilan = () => {
    const [habitude_alimentation, setHabitudeAlimentation] = useState([]);
    const [habitude_transport, setHabitudeTransport] = useState([]);
    const [habitude_numerique, setHabitudeNumerique] = useState([]);
    const [HT_totalCO2, setHT_TotalCO2] = useState('');
    const [HN_totalCO2, setHN_TotalCO2] = useState('');
    const [HA_totalCO2, setHA_TotalCO2] = useState('');
    const [totalCO2, setTotalCO2] = useState('');
    const [showTransport, setShowTransport] = useState(false);
    const [showNumerique, setShowNumerique] = useState(false);
    const [showAlimentation, setShowAlimentation] = useState(false);
    const { user, token } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const savedDataAlimentation = sessionStorage.getItem('alimentationData');
        const savedDataTransport = sessionStorage.getItem('transportData');
        const savedDataNumerique = sessionStorage.getItem('numeriqueData');
        const savedTotalCO2 = sessionStorage.getItem('totalCO2');
        const savedHT_TotalCO2 = sessionStorage.getItem('HT_totalCO2');
        const savedHN_TotalCO2 = sessionStorage.getItem('HN_totalCO2');
        const savedHA_TotalCO2 = sessionStorage.getItem('HA_totalCO2');
        if (savedDataAlimentation) {
            setHabitudeAlimentation(JSON.parse(savedDataAlimentation))
        }
        if (savedDataTransport) {
            setHabitudeTransport(JSON.parse(savedDataTransport))
        }
        if (savedDataNumerique) {
            setHabitudeNumerique(JSON.parse(savedDataNumerique))
        }
        if (savedTotalCO2) {
            setTotalCO2(savedTotalCO2)
        }
        if (savedHT_TotalCO2) {
            setHT_TotalCO2(savedHT_TotalCO2)
        }
        if (savedHN_TotalCO2) {
            setHN_TotalCO2(savedHN_TotalCO2)
        }
        if (savedHA_TotalCO2) {
            setHA_TotalCO2(savedHA_TotalCO2)
        }
    }, []);

    const handleSaveBilan = async () => {
        const bilanData = {
            total_co2: totalCO2
        };

        const data = {
            bilanData,
            HTransportData: habitude_transport,
            HAlimData: habitude_alimentation,
            HNumData: habitude_numerique
        };

        try {
            const response = await axios.post(`${api.getApiUrl()}/users/${user.id}/bilan`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                console.log('Bilan créé avec succès');
                navigate('/');
            }
        } catch (error) {
            console.error('Erreur lors de la création du bilan:', error);
            alert('Erreur lors de la création du bilan');
        }
    };


    const dropBilan = () => {
        sessionStorage.clear();
        navigate('/');
    }

    return (
        <div>
            <NavBar />
            <FormularNavigator />
            <div id="containCompBilanChart">
                <BilanChart
                    totalCo2={totalCO2}
                    trsprtVal={HT_totalCO2}
                    numVal={HN_totalCO2}
                    AlimVal={HA_totalCO2}
                />

                <div className='TransportResultBilan' onClick={() => setShowTransport(!showTransport)}>
                    <div className='ResultBilanTitle'> Transport </div>
                    <div>
                        {showTransport && habitude_transport.map((item, index) => (
                            <div key={index}>Type transport: {item.vehicle} - Distance: {item.distances} - Frequence: {item.frequency} - Periode: {item.time_period} - Passagers: {item.passangers} - Co2_emis: {item.co2_emitted}kg</div>
                        ))}
                        {showTransport ?
                            <div> Total CO2 pour transports : {HT_totalCO2}</div>
                            : null}
                    </div>

                </div>

                <div className='NumeriqueResultBilan' onClick={() => setShowNumerique(!showNumerique)}>
                    <div className='ResultBilanTitle'>Numerique</div>
                    <div>
                        {showNumerique && habitude_numerique.map((item, index) => (
                            <div key={index}>Type appareil: {item.numerique_choosen} - Frequence: {item.frequency}</div>
                        ))}
                        {showNumerique ?
                            <div>Total CO2 pour numériques : {HN_totalCO2}</div>
                            : null}
                    </div>


                </div>
                <div className='AlimentationResultBilan' onClick={() => setShowAlimentation(!showAlimentation)}>
                    <div className='ResultBilanTitle'>Alimentation</div>
                    <div>
                        {showAlimentation && habitude_alimentation.map((item, index) => (
                            <div key={index}>Type aliment: {item.typeAliments} - Nom aliment: {item.nameAliments} - Consommations: {item.consommations} - CO2_emis: {item.co2_emitted}</div>
                        ))}
                        {showAlimentation ?
                            <div> Total CO2 pour alimentations : {HA_totalCO2}</div>
                            : null}
                    </div>

                </div>
                {
                    user.id ? (
                        <div className='saveordropBilanBox'>
                            <div className='dropBilanbutton' onClick={dropBilan}>
                                Abandonner le bilan
                            </div>
                            <div className='saveBilanbutton' onClick={handleSaveBilan}>
                                Sauvegarder le bilan
                            </div>
                        </div>

                    ) : null
                }

            </div>


            <div>
                <h2>Total CO2 Emitted: {totalCO2} kg</h2>
            </div>
            <Footer />
        </div>
    );
}

export default Bilan;
