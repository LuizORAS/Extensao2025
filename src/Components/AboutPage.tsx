
import React from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
    return (
        <div className="about-page-container">
            <div className="page-bg" />
            <div className="page-overlay" />
            <div className="about-page-content">
                <h1>About Us</h1>
                <p>Welcome to our application! This is a simple about page.</p>
                <p>We aim to provide the best service for our users.</p>
            </div>
        </div>
    );
};

export default AboutPage;