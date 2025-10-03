
import React, { useState } from "react";
import "./SettingsPage.css";

const OPTIONS = [
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'security', label: 'Security' },
];

const SettingsPage: React.FC = () => {
    const [active, setActive] = useState<string>('profile');

    const renderContent = () => {
        switch (active) {
            case 'profile':
                return (
                    <div>
                        <h2>Profile</h2>
                        <p>Placeholder for profile settings (name, email, contact).</p>
                    </div>
                );
            case 'notifications':
                return (
                    <div>
                        <h2>Notifications</h2>
                        <p>Placeholder to configure notification preferences.</p>
                    </div>
                );
            case 'appearance':
                return (
                    <div>
                        <h2>Appearance</h2>
                        <p>Placeholder to change theme and layout options.</p>
                    </div>
                );
            case 'integrations':
                return (
                    <div>
                        <h2>Integrations</h2>
                        <p>Placeholder to connect external services.</p>
                    </div>
                );
            case 'security':
                return (
                    <div>
                        <h2>Security</h2>
                        <p>Placeholder for password and access control.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="settings-page-container">
            <div className="settingspage-bg" />
            <div className="settingspage-overlay" />
            <div className="settings-page-card">
                <div className="settings-card-side">
                    <h3>Configurações</h3>
                    <ul className="settings-options">
                        {OPTIONS.map(o => (
                            <li key={o.id} className={"settings-option " + (active === o.id ? 'active' : '')} onClick={() => setActive(o.id)}>
                                {o.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="settings-card-main">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;