import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../ressources/logo.png';
import { useUser } from '../Components/context/UserContext';
import pp from '../ressources/pp.png';
import '../Styles/component-style/NavbarStyle.css';

const NavBar = () => {
    const { user, logout } = useUser();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== "/habitudeTransport"
            && location.pathname !== "/habitudeNumerique"
            && location.pathname !== "/habitudeAlimentation"
            && location.pathname !== "/bilan"
        ) {
            sessionStorage.removeItem('transportData');
            sessionStorage.removeItem('numeriqueData');
            sessionStorage.removeItem('alimentationData');
            sessionStorage.removeItem('HT_totalCO2');
            sessionStorage.removeItem('HN_totalCO2');
            sessionStorage.removeItem('HA_totalCO2');
            sessionStorage.removeItem('totalCO2');
        }
    }, [location]);

    const handleClick = () => {
        // Demander confirmation avant la déconnexion
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            logout(); // Utilisez logout de UserContext qui gère aussi la suppression du token
        }
    };



    return (
        <nav>
            <div id={user.id ? "ConnectNavBar" : "noConnectNavBar"}>
                <div>
                    <Link to="/">
                        <img id='LogoApp' src={logo} alt="Logo de l'application web" />
                    </Link>
                </div>

                {user.id ? (
                    <>
                        <div className='navlink'><Link to="/habitudeTransport">Faire le test</Link></div>
                        <div className='navlink'><Link to="/bilan">Mon Bilan</Link></div>
                        <div className='navlink'><Link to="/compareBilan">Comparer mes bilans</Link></div>
                        <div className='navlink'><Link to="/historique">Mon historique</Link></div>
                        <div className='navlink'><Link to="/compareRegion">Comparer les régions</Link></div>
                        {user.type_utilisateur === "Admin" ? (<>
                            <div className='navlink'><Link to="/adminusers">Gestion utilisateurs</Link></div>
                            <div className='navlink'><Link to="/adminbdd">Gestion Base de données</Link></div>
                        </>) : null
                        }

                        <div id="profileAndButton">
                            <div>
                                <button id="logoutButton" className="button" onClick={handleClick}>
                                    SE DÉCONNECTER
                                </button>
                            </div>
                            <div>
                                <Link to="/userProfile">
                                    <img className='avatar_image_nav' src={user.avatar_url || pp} alt="Profil utilisateur" />
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='navlink'><Link to="/compareRegion">Comparer les régions</Link></div>
                        <div>
                            <Link to="/register"><button className="Register_ConnectBtn">S'inscrire</button></Link>
                            <Link to="/login"><button className="Register_ConnectBtn">Se connecter</button></Link>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
