import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/component-style/FormularNavigatorStyle.css';
import bilan from '../ressources/bilan.png';
import transport from '../ressources/transport.png';
import numerique from '../ressources/numerique.png';
import alimentation from '../ressources/alimentation.png';

function FormularNavigator() {
    const location = useLocation();
    const [openAccordion, setOpenAccordion] = useState("");

    useEffect(() => {
        switch (location.pathname) {
            case '/habitudeTransport':
                setOpenAccordion("a3");
                break;
            case '/habitudeNumerique':
                setOpenAccordion("a4");
                break;
            case '/habitudeAlimentation':
                setOpenAccordion("a5");
                break;
            case '/bilan':
                setOpenAccordion("a1");
                break;
            default:
                setOpenAccordion("");
                break;
        }
    }, [location]);

    return (
        <div className="accordion">
            <div className={openAccordion === "a3" ? "box a3 open" : "box a3 close"}>
                <div className="image_3">
                    <img className='image_3' src={transport} alt="Transport" />
                    <div className="text">
                        <h2>Transport</h2>
                        <p>Je renseigne mes habitudes de transport</p>
                    </div>
                </div>
            </div>
            <div className={openAccordion === "a4" ? "box a4 open" : "box close a4"}>
                <div className="image_4">
                    <img className='image_4' src={numerique} alt="Numerique" />
                    <div className="text">
                        <h2>Numerique</h2>
                        <p>Je renseigne mes habitudes numeriques</p>
                    </div>
                </div>
            </div>
            <div className={openAccordion === "a5" ? "box a5 open" : "box close a5"}>
                <div className="image_5">
                    <img className='image_5' src={alimentation} alt="Alimentation" />
                    <div className="text">
                        <h2>Alimentation</h2>
                        <p>Je renseigne mes habitudes alimentaires</p>
                    </div>
                </div>
            </div>
            <div className={openAccordion === "a1" ? "box a1 open" : "box close a1"}>
                <div className="image_1">
                    <img className='image_1' src={bilan} alt="Bilan" />
                    <div className="text">
                        <h2>Bilan</h2>
                        <p>Je visionne mon bilan carbone</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormularNavigator;
