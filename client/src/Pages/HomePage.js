import React from 'react';
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import logo from '../ressources/logo.png';
import { Link } from 'react-router-dom';

import '../Styles/style.css';

class HomePage extends React.Component {

    render() {
        return (
            <div>
                <NavBar />
                    <h1>Accueil</h1>
                    <div>
                        <img id="image-home" src={logo} alt="Logo de l'application web" />
                        <div id="TextContainer">
                            <div id="DivContainer" >
                                <p>
                                    Découvrez l'impact environnemental de vos habitudes quotidiennes en passant notre test d'empreinte carbone
                                </p>
                            </div>
                        </div>
                        <Link to="/habitudeTransport"><button id="HomeButton">Faire le test</button></Link>
                    </div>
                <Footer />
            </div>
        );
    }
}

export default HomePage;