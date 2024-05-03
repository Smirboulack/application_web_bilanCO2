import React from 'react';
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { Link } from 'react-router-dom';
import logo from '../ressources/logo.png';
import logoLyon1 from '../ressources/logoLyon1.png';

import '../Styles/style.css';

class MentionsLegales extends React.Component {
    render() {
        return (
            <div>
                <NavBar />
                <h1>A Propos</h1>
                <div>
                        <p>Ce site web est un projet réalisé dans le cadre d'un projet de l'UE m1if10 à l'Université Claude Bernard Lyon1.</p>
                        <p style={{ fontWeight: 'bold' }}>L'équipe de développement est composée de :</p>
                        <ul id="ul-style1">
                            <li>ABIDA Youssef</li>
                            <li>CORROLLER Nathan</li>
                            <li>DELIANOV Clara</li>
                            <li>DORIER Alexandre</li>
                            <li>TEMIRBOULATOV Koureich</li>
                            <li>TOUIL Ines</li>
                        </ul>
                        <p style={{ fontWeight: 'bold' }}>Technologies utilisées :</p>
                        <ul id="ul-style2">
                            <li>Frontend : librairie React + CSS</li>
                            <li>Backend : Node.js, Express.js</li>
                            <li>Design : Figma - Paint</li>
                            <li>BDD : PostgreSQL avec Dbeaver</li>
                            <li>CI/CD : SonarQube</li>
                        </ul>
                        <div className="image-container">
                            <img id="logo-eco" src={logo} alt="Logo de l'application web" />
                            <img src={logoLyon1} alt="Logo de l'université" />
                        </div>

                    <Link to="/"><button id="HomeButton">Retour à l'accueil</button></Link>
                </div>
                <Footer />
            </div>
        );
    }
}


export default MentionsLegales;