import React from 'react';
/* import { useNavigate } from 'react-router-dom'; */
import { useState, useEffect } from 'react';
import { useJwt } from 'react-jwt';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import pp from '../ressources/pp.png';
import { ReactComponent as EditButton } from '../ressources/svg/edit-button.svg';
import { ReactComponent as Deletebutton } from '../ressources/svg/DeleteButton.svg';
import axios from 'axios'; // Import Axios
import api from '../api';
import '../Styles/AdminUsers.css';


const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [token] = useState(localStorage.getItem('userToken'));
    const { decodedToken } = useJwt(token);

    useEffect(() => {
        const apiUrl = api.getApiUrl();
        axios.get(`${apiUrl}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            setUsers(response.data);
        }).catch(error => {
            console.error("Erreur lors de la récupération des données utilisateur:", error);
        });
    }, [token, decodedToken]);

    const handleEditClick = (userId, field, value) => {
        setEditingId(userId);
        setEditingField(field);
        setInputValue(value);
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditingField(null);
    };

    const handleSaveClick = async () => {
        const apiUrl = api.getApiUrl();
        const updatedData = {
            [editingField]: inputValue
        };

        axios.put(`${apiUrl}/users/${editingId}`, updatedData, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            const updatedUsers = users.map(user =>
                user.id === editingId ? { ...user, [editingField]: inputValue } : user
            );
            setUsers(updatedUsers);
            setEditingId(null);
            setEditingField(null);
        }).catch(error => {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        });
    };


    const deleteUser = (userId) => {
        const apiUrl = api.getApiUrl();
        if (userId !== decodedToken.userId) {
            if (window.confirm("Etes-vous sûr de vouloir supprimer cet utilisateur ?")) {
                axios.delete(`${apiUrl}/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(response => {
                        const updatedUsers = users.filter(user => user.id !== userId);
                        setUsers(updatedUsers);
                    })
                    .catch(error => {
                        console.error("Erreur lors de la suppression de l'utilisateur:", error);
                    });
            }
        } else {
            alert('Vous ne pouvez pas supprimer votre propre compte depuis cette page');
        }
    };

    return (
        <div>
            <NavBar />
            <h1>Gestion des utilisateurs</h1>
            <div className='AdminViewUsersMainBox'>
                <div className='UsersInfoBar'>
                    <div className='UsersInfoBar-Row'>
                        <div>Avatar</div>
                        <div>Pseudo</div>
                        <div>Rôle</div>
                        <div>Email</div>
                        <div>Status</div>
                        <div>Action</div>
                    </div>
                </div>
                <div className='UserLists'>
                    {users.map((user) => (
                        <div key={user.id} className='UserLists-Row'>
                            <img className='avatar_image_nav' src={user.avatar_url || pp} alt="Profil utilisateur" />
                            {editingId === user.id && editingField ? (
                                <input
                                    type={editingField === "email" ? "email" : "text"}
                                    name={editingField}
                                    value={inputValue}
                                    onChange={handleChange}
                                    style={{ margin: '10px' }}
                                />
                            ) : (
                                <React.Fragment>
                                    <div onClick={() => handleEditClick(user.id, 'pseudo', user.pseudo)}>{user.pseudo}</div>
                                    <div onClick={() => handleEditClick(user.id, 'type_utilisateur', user.type_utilisateur)}>{user.type_utilisateur}</div>
                                    <div onClick={() => handleEditClick(user.id, 'email', user.email)}>{user.email}</div>
                                </React.Fragment>
                            )}
                            <div>{user.est_connecte ? 'En ligne' : 'Hors ligne'}</div>
                            <div className='UserLists-Row-Tools'>
                                {editingId === user.id ? (
                                    <React.Fragment>
                                        <button onClick={handleSaveClick} style={{ width: '60px', height: '40px' }}>Save</button>
                                        <button onClick={handleCancelClick} style={{ width: '60px', height: '40px' }}>Cancel</button>
                                    </React.Fragment>
                                ) : (
                                    <EditButton className='editButtonAdmin' onClick={() => handleEditClick(user.id, 'pseudo', user.pseudo)} style={{ width: '40px', height: '40px' }} />
                                )}
                                <div className='deleteButtonAdmin'><Deletebutton onClick={() => deleteUser(user.id)} style={{ width: '40px', height: '40px' }} /></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminUsers;