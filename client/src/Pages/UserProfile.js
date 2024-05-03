import React, { useState } from 'react';
import { useUser } from '../Components/context/UserContext';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import '../Styles/UserProfile.css';
import pp from '../ressources/pp.png';
import { ReactComponent as PieChart } from '../ressources/svg/pie-chart.svg';
import { ReactComponent as EditButton } from '../ressources/svg/edit-button.svg';
import axios from 'axios'; // Import Axios
import api from '../api';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user, setUser, token } = useUser();
    const [edit, setEdit] = useState({ pseudo: false, email: false, mot_de_passe: false });
    const [inputValues, setInputValues] = useState({ pseudo: '', email: '', mot_de_passe: '' });
    const [successMessage, setSuccessMessage] = useState('');

    const handleEdit = (field) => {
        setInputValues(prev => ({ ...prev, [field]: user[field] || '' }));
        setEdit(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (e, field) => {
        setInputValues({ ...inputValues, [field]: e.target.value });
    };

    const handleSave = async (field) => {
        const apiUrl = api.getApiUrl();
        const updateData = {
            [field]: inputValues[field]
        };

        axios.put(`${apiUrl}/users/${user.id}`, updateData, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setUser({ ...user, [field]: inputValues[field] });
                setEdit(prev => ({ ...prev, [field]: false }));
                setSuccessMessage("Profil mis à jour avec succès!");
            })
            .catch(error => {
                console.error("Erreur lors de la mise à jour du profil:", error);
            });
    };

    const suppressionAlert = () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
            const apiUrl = api.getApiUrl();
            axios.delete(`${apiUrl}/users/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    setSuccessMessage("Compte supprimé avec succès!");
                    localStorage.removeItem('userToken');
                    setTimeout(() => navigate('/'), 2000);
                    setTimeout(() => window.location.reload(), 2000);
                })
                .catch(error => {
                    console.error("Erreur lors de la suppression du compte:", error);
                });
        }
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0]; // Récupérer le fichier
        if (!file) {
            console.error("Aucun fichier sélectionné.");
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file); // 'avatar' doit correspondre à la clé attendue par votre backend pour le fichier

        const apiUrl = api.getApiUrl();
        const userId = user.id;

        try {
            const response = await axios.post(`${apiUrl}/users/${userId}/avatar`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUser({ ...user, avatar_url: `${apiUrl}/${response.data.avatar_url}` });
            setSuccessMessage("Avatar mis à jour avec succès!");
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'avatar:", error);
        }
    };

    const modifyAvatar = () => {
        document.getElementById('avatarInput').click();
    };

    return (
        <div>
            <NavBar />
            {successMessage && <div className="successMessage">{successMessage}</div>}
            <div className="Profile_title">
                <div className="ProfileTitle">Bonjour {user.pseudo || "John Doe"} !</div>
            </div>

            <div className="profile_container">
                <div className="Profile_avatar">
                    <div className="Profile_avatar_content">
                        <div className='profile_avatar_image' onClick={modifyAvatar}>
                            <img src={user.avatar_url || pp} alt="Profil utilisateur" />
                        </div>
                        <input
                            id="avatarInput"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                        />
                        <div>{user.pseudo || "John Doe"}</div>
                    </div>
                </div>
                <div className="profileinfos">
                    <div className="profileinfos_content">
                        {['Pseudo', 'Email'].map((item, index) => (
                            <div key={index}>
                                <span>{item} : </span>
                                {edit[item.toLowerCase()] ?
                                    <input type="text" value={inputValues[item.toLowerCase()]} onChange={(e) => handleChange(e, item.toLowerCase())} />
                                    :
                                    <span className="profileinfocontentspan">{user[item.toLowerCase()] || 'N/A'}</span>
                                }
                                <span className="edit" onClick={() => handleEdit(item.toLowerCase())}><EditButton style={{ width: '20px', height: '20px' }} /></span>
                                {edit[item.toLowerCase()] && <button onClick={() => handleSave(item.toLowerCase())}>Save</button>}
                            </div>
                        ))}
                        <div>
                            Mot de passe :
                            {edit.mot_de_passe ?
                                <input type="password" value={inputValues.mot_de_passe} onChange={(e) => handleChange(e, 'mot_de_passe')} />
                                :
                                '********'
                            }
                            <span className="edit" onClick={() => handleEdit('mot_de_passe')}><EditButton style={{ width: '20px', height: '20px' }} /></span>
                            {edit.mot_de_passe && <button onClick={() => handleSave('mot_de_passe')}>Save</button>}
                        </div>
                    </div>

                </div>

            </div>

            <div className="LastRowProfile">
                <div className="Diagram">
                    <PieChart style={{ width: '128px', height: '128px' }} />
                </div>
            </div>

            <div className="deleteButton" onClick={suppressionAlert}>
                Supprimer le compte
            </div>
            <Footer />
        </div>
    );
};

export default UserProfile;
