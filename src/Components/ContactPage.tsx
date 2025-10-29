import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

import React from 'react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
    return (
        <div className="contact-page-container">
            <div className="contactpage-bg" />
            <div className="contactpage-overlay" />
            <div className="contact-page-content contact-page-icons-only">
                <div className="contact-socials">
                    <a className="social-item" href="https://www.linkedin.com/in/luiz-felipe-de-lima-barbosa/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <span className="social-icon"><FaLinkedin /></span>
                        <span className="social-label">LinkedIn</span>
                    </a>
                    <a className="social-item" href="https://github.com/LuizORAS" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <span className="social-icon"><FaGithub /></span>
                        <span className="social-label">GitHub</span>
                    </a>
                    <a className="social-item" href="https://www.instagram.com/luizlimabrb/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <span className="social-icon"><FaInstagram /></span>
                        <span className="social-label">Instagram</span>
                    </a>
                    <a className="social-item" href="mailto:luiz.barbosa@al.infnet.edu.br" target="_blank" rel="noopener noreferrer" aria-label="Email">
                        <span className="social-icon"><IoMdMail /></span>
                        <span className="social-label">Email</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;