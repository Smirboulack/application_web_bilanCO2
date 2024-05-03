import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/component-style/FooterStyle.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>© 2024 - All rights reserved</p>
            <p><Link to="/mentionsLegales">A propos</Link></p>
        </footer>
    );
};

export default Footer;