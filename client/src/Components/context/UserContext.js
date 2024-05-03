import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api'; // Ajustez le chemin selon votre structure de dossier
import { useJwt } from 'react-jwt';
import pp from '../../ressources/pp.png';

export const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('userToken'));
    const { decodedToken, isExpired } = useJwt(token); // isExpired peut vous aider à vérifier si le token est encore valide

    useEffect(() => {
        //const token = localStorage.getItem('userToken');
        if (token && !isExpired && decodedToken?.userId) { // S'assure que le token existe, n'est pas expiré et contient userId
            const apiUrl = api.getApiUrl();
            axios.get(`${apiUrl}/users/${decodedToken.userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    const avatarUrl = response.data.avatar_url ? `${apiUrl}/${response.data.avatar_url}` : pp;
                    setUser({ ...response.data, avatar_url: avatarUrl });
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des données utilisateur:", error);
                });
        }
    }, [token, decodedToken, isExpired]);



    const login = (newToken) => {
        setToken(newToken);
        navigate('/'); // Rediriger l'utilisateur vers la page d'accueil
        refreshPage(); // Rafraîchir la page pour mettre à jour l'interface
    };

    const refreshPage = () => {
        window.location.reload();
    };

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setToken(null);
        setUser({});
        navigate('/'); // Rediriger l'utilisateur vers la page de connexion
        refreshPage(); // Rafraîchir la page pour mettre à jour l'interface
    };

    return (
        <UserContext.Provider value={{ user, setUser, token, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
