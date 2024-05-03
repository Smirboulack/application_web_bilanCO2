import React from 'react';
import '../Styles/style.css';
import BilanPieChart from "./BilanPieChart";

const BilanChart = ({ totalCo2, trsprtVal, numVal, AlimVal }) => {
    return (
        <div id="BilanChartContain">
            <div id="textPercentBilan">
                <h2>BILAN TOTAL</h2>
                <ul>
                    <p> Votre consommation total est de :
                        <br />
                        <b>{totalCo2}</b> Kg de CO2
                    </p>
                    <p>Ce total de consommation est composé de :</p>
                    <li><p><b>{trsprtVal}</b> Kg de Transport</p></li>
                    <li><p><b>{numVal}</b> Kg de Numérique</p></li>
                    <li><p><b>{AlimVal}</b> Kg d'Alimentation</p></li>
                </ul>
            </div>
            <div>
                <BilanPieChart transportValue={trsprtVal.valueOf()} numeriqueValue={numVal.valueOf()} AlimentationValu={AlimVal.valueOf()} />
            </div>
        </div>
    );
};

export default BilanChart;