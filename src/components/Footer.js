import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    let currentYear = new Date().getFullYear();
    return (
        <footer>
            <p>Copyright © {currentYear} <Link style={{ color: '#0e0ee9', fontWeight: '700' }} to={'/team'}>FinTrack</Link> </p>
            <p>Made with 💖 in India</p>
        </footer>
    );
}

export default Footer;