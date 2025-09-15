
import React from "react";
import "./SettingsPage.css";

const SettingsPage: React.FC = () => {
    return (
        <div className="settings-page-container">
            <div className="settingspage-bg" />
            <div className="settingspage-overlay" />
            <div className="settings-page-content">
                <h1>Settings</h1>
                <div className="settings-content">
                    <label className="settings-label">
                        <span>Notification Preferences:</span>
                        <select className="settings-select">
                            <option value="all">All Notifications</option>
                            <option value="important">Important Only</option>
                            <option value="none">None</option>
                        </select>
                    </label>
                    <label className="settings-label">
                        <span>Theme:</span>
                        <select className="settings-select">
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;