import React, { useState } from 'react';
import { Link } from "react-router-dom";
import backArrow from '../ressources/backArrow.png';
import { useUser } from '../Components/context/UserContext';
import axios from 'axios';
import api from '../api';

function Login() {
    const { login } = useUser();
    const [pseudo, setPseudo] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // État pour le message de succès

    const handleChangePseudo = (event) => {
        setPseudo(event.target.value);
    };

    const handleChangeMotDePasse = (event) => {
        setMotDePasse(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage(''); // Réinitialise le message d'erreur

        axios.post(`${api.getApiUrl()}/users/login`, {
            pseudo,
            mot_de_passe: motDePasse,
        })
            .then(response => {
                localStorage.setItem('userToken', response.data.token);
                setSuccessMessage('Connexion réussie. Redirection...'); // Affiche le message de succès
                setTimeout(() => login(response.data.token), 2000);
                //login(response.data.token)
            })
            .catch(error => {
                const message = error.response && error.response.data && error.response.data.message
                    ? error.response.data.message
                    : "Une erreur s'est produite lors de la connexion.";
                console.error('Login error:', message);
                setErrorMessage(message);
            });
    };

    return (
        <div id="loginRegisterPage">
            <div id="backArrowID">
                <Link to="/">
                    <img src={backArrow} alt="Logo de flèche de retour" />
                </Link>
            </div>
            <div className='loginRegisterForm'>
                <h1>Connexion</h1>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Affiche le message de succès */}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="pseudo">Pseudo</label>
                    <div>
                        <input type="text" id="pseudo" name="pseudo" placeholder="Pseudo" required value={pseudo} onChange={handleChangePseudo} />
                    </div>
                    <label htmlFor="mot_de_passe">Mot de passe</label>
                    <div>
                        <input type="password" id="mot_de_passe" name="mot_de_passe" placeholder="Mot de passe" required value={motDePasse} onChange={handleChangeMotDePasse} />
                    </div>
                    <button type="submit">Se connecter</button>
                </form>
                <Link to="/register">S'inscrire</Link>
            </div>
        </div>
    );
}

export default Login;
