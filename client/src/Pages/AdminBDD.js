import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '../Components/context/UserContext';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import axios from 'axios'; // Import Axios
import api from '../api';
import '../Styles/AdminBDD.css';


const AdminBDD = () => {
    const [tableTransports, setTableTransports] = useState([]);
    const [tableNumeriques, setTableNumeriques] = useState([]);
    const [tableAlimentations, setTableAlimentations] = useState([]);
    const [edit, setEdit] = useState({ row: null, field: null, value: '' });
    const fieldsToShowTransports = ['id', 'type_transport', 'details', 'co2_construction', 'co2_utilisation', 'unite'];
    const fieldsToShowNumeriques = ['id', 'type_numerique', 'details', 'co2_construction', 'co2_utilisation', 'unite'];
    const fieldsToShowAlimentations = ['id', 'type_aliment', 'nom_aliment', 'co2_emis', 'unite'];
    const { token } = useUser();

    useEffect(() => {
        axios.get(`${api.getApiUrl()}/transport`).then(response => {
            setTableTransports(response.data);
        }).catch(error => {
            console.error("Erreur lors de la récupération des données transports:", error);
        });

        axios.get(`${api.getApiUrl()}/numerique`).then(response => {
            setTableNumeriques(response.data);
        }).catch(error => {
            console.error("Erreur lors de la récupération des données numeriques:", error);
        });

        axios.get(`${api.getApiUrl()}/alimentation`).then(response => {
            setTableAlimentations(response.data);
        }).catch(error => {
            console.error("Erreur lors de la récupération des données alimentations:", error);
        });
    }, [token]);

    const handleTransportRowChange = (event, id, field) => {
        if (event.key === 'Enter') {
            const updatedTable = tableTransports.map(item => {
                if (item.id === id) {
                    return { ...item, [field]: edit.value };
                }
                return item;
            });
            setTableTransports(updatedTable);

            axios.put(`${api.getApiUrl()}/transport/${id}`, { [field]: edit.value }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Mise à jour réussie:', response);
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour:', error);
                });

            setEdit({ row: null, field: null, value: '' }); // Reset edit state
        }
    };


    const handleNumeriqueRowChange = (event, id, field) => {
        if (event.key === 'Enter') {
            const updatedTable = tableNumeriques.map(item => {
                if (item.id === id) {
                    return { ...item, [field]: edit.value };
                }
                return item;
            });
            setTableNumeriques(updatedTable);

            axios.put(`${api.getApiUrl()}/numerique/${id}`, { [field]: edit.value }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Mise à jour réussie:', response);
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour:', error);
                });

            setEdit({ row: null, field: null, value: '' }); // Reset edit state
        }
    };


    const handleAlimentationRowChange = (event, id, field) => {
        if (event.key === 'Enter') {
            const updatedTable = tableAlimentations.map(item => {
                if (item.id === id) {
                    return { ...item, [field]: edit.value };
                }
                return item;
            });
            setTableAlimentations(updatedTable);

            axios.put(`${api.getApiUrl()}/alimentation/${id}`, { [field]: edit.value }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Mise à jour réussie:', response);
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour:', error);
                });

            setEdit({ row: null, field: null, value: '' }); // Reset edit state
        }
    };

    const deleteTransportRow = (id) => {
        const updatedTable = tableTransports.filter(item => item.id !== id);
        setTableTransports(updatedTable);

        axios.delete(`${api.getApiUrl()}/transport/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Suppression réussie:', response);
            })
            .catch(error => {
                console.error('Erreur lors de la suppression:', error);
            });
    };


    const deleteNumeriqueRow = (id) => {
        const updatedTable = tableNumeriques.filter(item => item.id !== id);
        setTableNumeriques(updatedTable);

        axios.delete(`${api.getApiUrl()}/numerique/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Suppression réussie:', response);
            })
            .catch(error => {
                console.error('Erreur lors de la suppression:', error);
            });
    };


    const deleteAlimentationRow = (id) => {
        const updatedTable = tableAlimentations.filter(item => item.id !== id);
        setTableAlimentations(updatedTable);

        axios.delete(`${api.getApiUrl()}/alimentation/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Suppression réussie:', response);
            })
            .catch(error => {
                console.error('Erreur lors de la suppression:', error);
            });
    };



    const handleEdit = (item, field) => {
        setEdit({ row: item.id, field, value: item[field] });
    };

    return (
        <div>
            <NavBar />
            <h1>Gestion de la Base de données</h1>
            <main>
                {/* Table des Transports */}
                <div className='tableContainer'>
                    <h2>Transports</h2>
                    <div className='scrollTableContainer'>
                        <table className='dataTable'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type transport</th>
                                    <th>Details</th>
                                    <th>Co2 construction</th>
                                    <th>Co2 utilisation</th>
                                    <th>Unité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableTransports.map((item, index) => (
                                    <tr key={index}>
                                        {fieldsToShowTransports.map((key) => (

                                            <td key={key} onClick={() => handleEdit(item, key)}>
                                                {edit.row === item.id && edit.field === key ?
                                                    <input
                                                        type="text"
                                                        value={edit.value}
                                                        autoFocus
                                                        onChange={(e) => setEdit({ ...edit, value: e.target.value })}
                                                        onKeyDown={(e) => handleTransportRowChange(e, item.id, key)}
                                                        onBlur={() => setEdit({ row: null, field: null, value: '' })}
                                                    />
                                                    : item[key]
                                                }
                                            </td>
                                        ))}
                                        <td onClick={() => deleteTransportRow(item.id)} style={{ cursor: 'pointer', color: 'red' }}>
                                            &#10005; {/* This is a Unicode multiplication sign, used here as a simple "X" */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Table des Produits Numériques */}
                <div className='tableContainer'>
                    <h2>Numériques</h2>
                    <div className='scrollTableContainer'>
                        <table className='dataTable'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type numérique</th>
                                    <th>details</th>
                                    <th>Co2 construction</th>
                                    <th>Co2 utilisation</th>
                                    <th>unité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableNumeriques.map((item, index) => (
                                    <tr key={index}>
                                        {fieldsToShowNumeriques.map((key) => (
                                            <td key={key} onClick={() => handleEdit(item, key)}>
                                                {edit.row === item.id && edit.field === key ?
                                                    <input
                                                        type="text"
                                                        value={edit.value}
                                                        autoFocus
                                                        onChange={(e) => setEdit({ ...edit, value: e.target.value })}
                                                        onKeyDown={(e) => handleNumeriqueRowChange(e, item.id, key)}
                                                        onBlur={() => setEdit({ row: null, field: null, value: '' })}
                                                    />
                                                    : item[key]
                                                }
                                            </td>
                                        ))}
                                        <td onClick={() => deleteNumeriqueRow(item.id)} style={{ cursor: 'pointer', color: 'red' }}>
                                            &#10005; {/* This is a Unicode multiplication sign, used here as a simple "X" */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Table des Alimentations */}
                <div className='tableContainer'>
                    <h2>Alimentations</h2>
                    <div className='scrollTableContainer'>
                        <table className='dataTable'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type aliment</th>
                                    <th>Nom aliment</th>
                                    <th>Co2 emis</th>
                                    <th>Unité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableAlimentations.map((item, index) => (
                                    <tr key={index}>
                                        {fieldsToShowAlimentations.map((key) => (
                                            <td key={key} onClick={() => handleEdit(item, key)}>
                                                {edit.row === item.id && edit.field === key ?
                                                    <input
                                                        type="text"
                                                        value={edit.value}
                                                        autoFocus
                                                        onChange={(e) => setEdit({ ...edit, value: e.target.value })}
                                                        onKeyDown={(e) => handleAlimentationRowChange(e, item.id, key)}
                                                        onBlur={() => setEdit({ row: null, field: null, value: '' })}
                                                    />
                                                    : item[key]
                                                }
                                            </td>
                                        ))}
                                        <td onClick={() => deleteAlimentationRow(item.id)} style={{ cursor: 'pointer', color: 'red' }}>
                                            &#10005; {/* This is a Unicode multiplication sign, used here as a simple "X" */}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminBDD;
