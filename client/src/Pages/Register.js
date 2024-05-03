import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backArrow from '../ressources/backArrow.png';
import api from '../api';
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pseudo: '',
        mot_de_passe: '',
        email: '',
        date_de_naissance: '',
    });

    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('red');

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let { pseudo, mot_de_passe, email, date_de_naissance } = formData;
        date_de_naissance = date_de_naissance.replace(/-/g, '_');

        if (pseudo && mot_de_passe.length >= 8 && email && date_de_naissance) {
            axios.post(`${api.getApiUrl()}/users/signup/`, {
                pseudo,
                date_de_naissance,
                email,
                mot_de_passe,
            })
                .then(response => {
                    setMessage('Inscription réussie ! Vous allez être redirigé.');
                    setMessageColor('green');
                    setTimeout(() => navigate('/login'), 2000); // Redirection après 2 secondes
                })
                .catch(error => {
                    // Ici, on analyse le message d'erreur retourné par l'API
                    const errorMessage = error.response && error.response.data.message;
                    if (errorMessage) {
                        if (errorMessage.includes("pseudo")) {
                            setMessage('Ce pseudo est déjà utilisé. Veuillez en choisir un autre.');
                        } else if (errorMessage.includes("email")) {
                            setMessage('Cet email est déjà utilisé. Veuillez en choisir un autre.');
                        } else {
                            setMessage('Erreur lors de l\'inscription. Veuillez réessayer.');
                        }
                    } else {
                        setMessage('Erreur lors de l\'inscription. Veuillez réessayer.');
                    }
                    setMessageColor('red');
                });
        } else {
            setMessage('Validation Failed');
            setMessageColor('red');
        }
    };

    // Calcul de la date maximale (l'utilisateur doit avoir au moins 13 ans)
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate()).toISOString().split('T')[0];

    return (
        <div id="loginRegisterPage" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div id="backArrowID" style={{ alignSelf: 'flex-start' }}>
                <Link to="/">
                    <img src={backArrow} alt="Logo de flèche de retour" />
                </Link>
            </div>
            <div>
                <h1>Inscription</h1>
                {message && <p style={{ color: messageColor }}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    {/* Les champs du formulaire */}
                    <div style={{ margin: '10px 0' }}>
                        <label htmlFor="pseudo">Pseudo</label>
                        <input type="text" id="pseudo" name="pseudo" placeholder="Pseudo" required style={{ width: '100%' }} minLength="3" maxLength="18" onChange={handleChange} />
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <label htmlFor="mot_de_passe">Mot de passe</label>
                        <input type="password" id="mot_de_passe" name="mot_de_passe" placeholder="Mot de passe" required style={{ width: '100%' }} minLength="8" onChange={handleChange} />
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Email" required style={{ width: '100%' }} onChange={handleChange} />
                    </div>
                    <div style={{ margin: '10px 0' }}>
                        <label htmlFor="date_de_naissance">Date de naissance</label>
                        <input type="date" id="date_de_naissance" name="date_de_naissance" placeholder="Date de naissance" required max={maxDate} style={{ width: '100%' }} onChange={handleChange} />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px', margin: '20px 0' }}>S'inscrire</button>
                </form>
                <Link to="/login">Se Connecter</Link>
            </div>
        </div>
    );
}

export default Register;
