import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../Styles/style.css';


const COLORS = ['#308474', '#CCC3B3', '#E4C1F9'];

const BilanPieChart = ({ transportValue, numeriqueValue, AlimentationValu }) => {

    const dataCo2 = [
        { name: 'TransportValueCO2', value: parseFloat(transportValue) },
        { name: 'NumeriqueValueCO2', value: parseFloat(numeriqueValue) },
        { name: 'AlimentationValueCO2', value: parseFloat(AlimentationValu) },
    ];

    return (
        <div id="pieStyle">
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        dataKey="value"
                        data={dataCo2}
                        label
                    >
                        {dataCo2.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default BilanPieChart;